use crate::dependencies::add_dev_dependency;
use rayon::prelude::*;
use serde_json::{json, Value};
use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;

use crate::config::{APPS_DIR, LIBS_DIR, PACKAGE_JSON, PACKAGE_TMPL_JSON};

pub type BoxError = Box<dyn std::error::Error + Send + Sync>;

/// Initializes the project and installs all dependencies.
///
/// This function performs the following steps:
/// 1. Initializes the package.json file
/// 2. Adds the 'concurrently' dev dependency
/// 3. Runs npm install in the root directory
/// 4. Installs dependencies for all sub-projects
///
/// # Returns
///
/// * `Result<(), BoxError>` - Ok(()) if all operations are successful,
///   or an error if any step fails.
///
/// # Errors
///
/// This function will return an error if:
/// * The package.json initialization fails
/// * Adding the 'concurrently' dev dependency fails
/// * The npm install process fails
/// * Installing project dependencies fails
pub fn initialize_and_install_all() -> Result<(), BoxError> {
    println!("🚀 Initializing and installing all dependencies...");
    let root_dir = initialize_package_json()?;

    // we use concurrently to run multiple npm scripts concurrently
    add_dev_dependency("concurrently").map_err(BoxError::from)?;

    run_npm_install(&root_dir)?;
    install_project_dependencies(&root_dir)?;
    println!("✅ All dependencies installed successfully! 🎉");
    Ok(())
}

/// Initializes the package.json file in the root directory of the project.
///
/// This function performs the following steps:
/// 1. Locates the root directory of the project.
/// 2. Reads the template package.json file (package-tmpl.json).
/// 3. Dynamically finds and merges scripts from all apps in the 'apps' directory (defined by APPS_DIR).
/// 4. Dynamically finds and merges scripts from all libs in the 'libs' directory (defined by LIBS_DIR).
/// 5. Creates and adds a new 'dev' script that runs all app and lib dev scripts concurrently.
/// 6. Writes the final package.json file to the root directory.
///
/// # Returns
///
/// * `Result<PathBuf, BoxError>` - The path to the root directory if successful,
///   or an error if any step fails.
///
/// # Errors
///
/// This function will return an error if:
/// * The root directory cannot be found
/// * The package-tmpl.json file is not found in the root directory
/// * There are issues reading or parsing the template or any package.json files
/// * There are problems creating or writing the final package.json file
///
/// # Examples
///
/// ```
/// match initialize_package_json() {
///     Ok(root_dir) => println!("Successfully initialized package.json in {}", root_dir.display()),
///     Err(e) => eprintln!("Failed to initialize package.json: {}", e),
/// }
/// ```
fn initialize_package_json() -> Result<PathBuf, BoxError> {
    println!("📦 Initializing package.json...");
    let current_dir = env::current_dir().map_err(BoxError::from)?;
    let root_dir = current_dir
        .ancestors()
        .nth(1)
        .ok_or_else(|| BoxError::from("❌ Cannot find root directory 😢"))?
        .to_path_buf();

    let template_path = root_dir.join(PACKAGE_TMPL_JSON);
    let output_path = root_dir.join(PACKAGE_JSON);

    if !template_path.exists() {
        return Err(format!(
            "❌ {} not found in {}",
            PACKAGE_TMPL_JSON,
            root_dir.display()
        )
        .into());
    }

    let template_content = fs::read_to_string(&template_path).map_err(BoxError::from)?;
    let mut template: Value = serde_json::from_str(&template_content).map_err(BoxError::from)?;

    let mut scripts = json!({});

    // Dynamically find and merge scripts from all apps
    let apps_dir = root_dir.join(APPS_DIR);
    if apps_dir.is_dir() {
        for entry in fs::read_dir(apps_dir).map_err(BoxError::from)? {
            let entry = entry.map_err(BoxError::from)?;
            let path = entry.path();
            if path.is_dir() {
                let package_json_path = path.join(PACKAGE_JSON);
                if package_json_path.exists() {
                    let app_name = match path.file_name() {
                        Some(name) => match name.to_str() {
                            Some(s) => s,
                            None => continue,
                        },
                        None => continue,
                    };
                    merge_scripts(
                        &mut scripts,
                        &root_dir,
                        &format!("{}/{}/{}", APPS_DIR, app_name, PACKAGE_JSON),
                        app_name,
                    )?;
                }
            }
        }
    }

    // Dynamically find and merge scripts from all libs
    let libs_dir = root_dir.join(LIBS_DIR);
    if libs_dir.is_dir() {
        for entry in fs::read_dir(libs_dir).map_err(BoxError::from)? {
            let entry = entry.map_err(BoxError::from)?;
            let path = entry.path();
            if path.is_dir() {
                let package_json_path = path.join(PACKAGE_JSON);
                if package_json_path.exists() {
                    let lib_name = match path.file_name() {
                        Some(name) => match name.to_str() {
                            Some(s) => s,
                            None => continue,
                        },
                        None => continue,
                    };
                    merge_scripts(
                        &mut scripts,
                        &root_dir,
                        &format!("{}/{}/{}", LIBS_DIR, lib_name, PACKAGE_JSON),
                        lib_name,
                    )?;
                }
            }
        }
    }

    // Add the new dev script
    let dev_scripts = create_dev_scripts(&root_dir)?;
    scripts["dev"] = json!(dev_scripts);

    template["scripts"] = scripts;

    let output_content = serde_json::to_string_pretty(&template).map_err(BoxError::from)?;
    fs::write(output_path, output_content).map_err(BoxError::from)?;

    println!("✅ Successfully created package.json in the root directory 📄");
    Ok(root_dir)
}

/// Merges scripts from a package.json file into the main scripts object.
///
/// # Arguments
///
/// * `scripts` - A mutable reference to the Value object containing all scripts.
/// * `root_dir` - The root directory of the project.
/// * `relative_path` - The relative path to the package.json file.
/// * `prefix` - The prefix to be added to each script name.
///
/// # Returns
///
/// Returns `Ok(())` if successful, or an error if any operation fails.
///
/// # Examples
///
/// ```
/// use serde_json::json;
/// use std::path::Path;
///
/// let mut scripts = json!({});
/// let root_dir = Path::new("/path/to/project");
/// let relative_path = "apps/my-app/package.json";
/// let prefix = "my-app";
///
/// merge_scripts(&mut scripts, root_dir, relative_path, prefix).unwrap();
///
///  If the original package.json had a "start" script,
///  the merged scripts might now include:
///  {
///      "my-app:start": "cd apps/my-app && npm run start"
///  }
/// ```
fn merge_scripts(
    scripts: &mut Value,
    root_dir: &Path,
    relative_path: &str,
    prefix: &str,
) -> Result<(), BoxError> {
    let file_path = root_dir.join(relative_path);
    if !file_path.exists() {
        println!("⚠️ {} not found, skipping", relative_path);
        return Ok(());
    }

    let content = fs::read_to_string(&file_path).map_err(BoxError::from)?;
    let package: Value = serde_json::from_str(&content).map_err(BoxError::from)?;

    if let Some(package_scripts) = package["scripts"].as_object() {
        for (key, value) in package_scripts {
            let new_key = format!("{}:{}", prefix, key);
            let parent_path = match Path::new(relative_path).parent() {
                Some(path) => path,
                None => return Err(BoxError::from("❌ Invalid file path 😢")),
            };

            let script_value = format!(
                "cd {} && {}",
                parent_path.display(),
                value.as_str().unwrap_or("")
            );

            scripts[new_key] = json!(script_value);
        }
    }

    Ok(())
}

/// Creates a development script that runs all project components concurrently.
///
/// This function generates a command string that uses `concurrently` to run
/// development scripts for all project components simultaneously.
///
/// # Arguments
///
/// * `root_dir` - A `Path` reference to the root directory of the project.
///
/// # Returns
///
/// * `Result<String, BoxError>` - A Result containing the
///   generated command string or an error if something goes wrong.
///
/// # Behavior
///
/// 1. Adds a "libs:dev" script to run development for all libraries.
/// 2. Scans the "apps" directory (defined by APPS_DIR) for subdirectories containing a package.json file.
/// 3. For each valid app (excluding "organic-lever-web-e2e"), adds an "{app}:dev" script.
/// 4. Combines all scripts into a single `concurrently` command.
///
/// # Example
///
/// ```
/// let root_dir = Path::new("/path/to/project");
/// let dev_script = create_dev_scripts(root_dir)?;
/// // dev_script might look like:
/// // "concurrently \"npm run libs:dev\" \"npm run app1:dev\" \"npm run app2:dev\""
/// ```
fn create_dev_scripts(root_dir: &Path) -> Result<String, BoxError> {
    let mut scripts = Vec::new();

    // Add libs dev script
    scripts.push("npm run libs:dev".to_string());

    // Collect app scripts
    if let Ok(entries) = fs::read_dir(root_dir.join(APPS_DIR)) {
        for entry in entries {
            if let Ok(entry) = entry {
                let path = entry.path();
                if path.is_dir() && path.join(PACKAGE_JSON).exists() {
                    match path.file_name() {
                        Some(name) => match name.to_str() {
                            Some(name_str) => {
                                if name_str != "organic-lever-web-e2e" {
                                    // Exclude e2e from dev script
                                    scripts.push(format!("npm run {}:dev", name_str));
                                }
                            }
                            None => continue,
                        },
                        None => continue,
                    }
                }
            }
        }
    }

    Ok(format!(
        "concurrently {}",
        scripts
            .iter()
            .map(|s| format!("\"{}\"", s))
            .collect::<Vec<_>>()
            .join(" ")
    ))
}

/// Installs dependencies for all projects in the `libs` and `apps` directories.
///
/// This function traverses the `libs` (LIBS_DIR) and `apps` (APPS_DIR) directories,
/// identifying npm projects and installing their dependencies.
///
/// # Arguments
///
/// * `root_dir` - A `Path` representing the root directory of the project.
///
/// # Returns
///
/// * `Result<(), BoxError>` - Ok(()) if all dependencies are installed successfully,
///   or an error if something goes wrong during the installation process.
///
/// # Example
///
/// ```
/// use std::path::Path;
///
/// let root_dir = Path::new("/path/to/project");
/// match install_project_dependencies(root_dir) {
///     Ok(()) => println!("All dependencies installed successfully"),
///     Err(e) => eprintln!("Error installing dependencies: {}", e),
/// }
/// ```
fn install_project_dependencies(root_dir: &Path) -> Result<(), BoxError> {
    println!("📚 Installing project dependencies...");
    let libs_dir = root_dir.join(LIBS_DIR);
    let apps_dir = root_dir.join(APPS_DIR);

    // Install dependencies for libs sequentially
    install_dependencies_in_dir(&libs_dir)?;

    // Install dependencies for apps in parallel
    install_dependencies_in_apps_parallel(&apps_dir)?;

    println!("✅ All project dependencies installed successfully! 🎉");
    Ok(())
}

/// Installs dependencies for all npm projects in a given directory.
///
/// This function traverses the given directory, identifying npm projects
/// and installing their dependencies.
///
/// # Arguments
///
/// * `dir` - A `&Path` representing the directory to search for npm projects.
///
/// # Returns
///
/// * `Result<(), BoxError>` - Ok(()) if all dependencies are installed successfully,
///   or an error if something goes wrong during the installation process.
///
/// # Errors
///
/// This function will return an error if:
/// * The directory cannot be read
/// * There's an issue accessing a subdirectory
/// * The `install_project_if_npm` function returns an error
fn install_dependencies_in_dir(dir: &Path) -> Result<(), BoxError> {
    if dir.is_dir() {
        for entry in fs::read_dir(dir).map_err(BoxError::from)? {
            let entry = entry.map_err(BoxError::from)?;
            let path = entry.path();
            if path.is_dir() {
                if is_npm_project(&path) {
                    run_npm_install(&path)?;
                }
                // TODO: Add checks and installations for other project types
            }
        }
    }
    Ok(())
}

/// Installs dependencies for all npm projects in the "apps" directory in parallel.
///
/// This function uses the `rayon` crate to install dependencies for all npm projects
/// in the "apps" directory in parallel, with a maximum number of workers based
/// on the available CPU cores.
///
/// # Arguments
///
/// * `dir` - A `&Path` representing the directory to search for npm projects.
///
/// # Returns
///
/// * `Result<(), BoxError>` - Ok(()) if all dependencies are installed successfully,
///   or an error if something goes wrong during the installation process.
///
/// # Errors
///
/// This function will return an error if:
/// * The directory cannot be read
/// * There's an issue accessing a subdirectory
/// * The `run_npm_install` function returns an error
fn install_dependencies_in_apps_parallel(dir: &Path) -> Result<(), BoxError> {
    if !dir.is_dir() {
        return Ok(());
    }

    let cpu_count = num_cpus::get();
    let max_workers = std::cmp::max(1, cpu_count - 1); // Use all cores except one
    println!(
        "🚀 Installing app dependencies in parallel (max {} workers)",
        max_workers
    );

    let pool = rayon::ThreadPoolBuilder::new()
        .num_threads(max_workers)
        .build()
        .map_err(BoxError::from)?;

    let completed_count = Arc::new(AtomicUsize::new(0));
    let total_count = Arc::new(AtomicUsize::new(0));

    let result: Result<(), BoxError> = pool.install(|| {
        fs::read_dir(dir)
            .map_err(BoxError::from)?
            .filter_map(Result::ok)
            .filter(|entry| entry.path().is_dir())
            .collect::<Vec<_>>()
            .par_iter()
            .try_for_each(|entry| -> Result<(), BoxError> {
                let path = entry.path();
                total_count.fetch_add(1, Ordering::SeqCst);
                if is_npm_project(&path) {
                    run_npm_install(&path)?;
                    let completed = completed_count.fetch_add(1, Ordering::SeqCst) + 1;
                    let total = total_count.load(Ordering::SeqCst);
                    println!("Progress: {}/{} apps completed", completed, total);
                }
                Ok(())
            })
    });

    result
}

/// Determines if a given directory is an npm project.
///
/// This function checks for the existence of a `package.json` file
/// in the provided directory, which is a standard indicator of an npm project.
///
/// # Arguments
///
/// * `project_dir` - A `&Path` representing the directory to check.
///
/// # Returns
///
/// * `bool` - Returns `true` if a `package.json` file exists in the directory,
///            indicating it's likely an npm project. Returns `false` otherwise.
fn is_npm_project(project_dir: &Path) -> bool {
    let package_json_path = project_dir.join(PACKAGE_JSON);
    package_json_path.exists()
}

/// Runs `npm install` in the specified directory.
///
/// This function executes the `npm install` command in the given directory,
/// which installs all dependencies specified in the `package.json` file.
///
/// # Arguments
///
/// * `dir` - A `&Path` representing the directory where `npm install` should be run.
///
/// # Returns
///
/// * `Result<(), BoxError>` - Ok(()) if the installation is successful,
///   or an error if the installation fails.
///
/// # Errors
///
/// This function will return an error if:
/// * The `npm install` command fails to execute
/// * The command executes but returns a non-zero exit status
///
/// # Examples
///
/// ```
/// use std::path::Path;
///
/// let project_dir = Path::new("/path/to/your/project");
/// match run_npm_install(project_dir) {
///     Ok(()) => println!("npm install completed successfully"),
///     Err(e) => eprintln!("npm install failed: {}", e),
/// }
/// ```
pub fn run_npm_install(dir: &Path) -> Result<(), BoxError> {
    println!("🛠️ Running npm install in {}...", dir.display());
    let output = Command::new("npm")
        .arg("install")
        .current_dir(dir)
        .output()
        .map_err(BoxError::from)?;

    if output.status.success() {
        println!(
            "✅ npm install completed successfully in {} 🎉",
            dir.display()
        );
        Ok(())
    } else {
        let error_message = String::from_utf8_lossy(&output.stderr);
        Err(format!(
            "❌ npm install failed in {}: {} 😢",
            dir.display(),
            error_message
        )
        .into())
    }
}
