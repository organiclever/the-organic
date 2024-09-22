use crate::config::{PACKAGE_JSON, PACKAGE_TMPL_JSON};
use crate::BoxError;
use serde_json::{json, Value};
use std::fs;
use std::path::PathBuf;
use std::process::Command;

/// Adds dependencies to the project's package.json and package-tmpl.json files.
///
/// This function adds the specified packages to the project's dependency lists,
/// updating both the package.json and package-tmpl.json files. It also ensures
/// that the 'concurrently' package is added as a dev dependency if regular
/// dependencies are being added.
///
/// # Arguments
///
/// * `packages` - A vector of string slices representing the packages to be added.
/// * `is_dev` - A boolean indicating whether the packages should be added as
///              development dependencies (true) or regular dependencies (false).
///
/// # Returns
///
/// * `Result<(), BoxError>` - Ok(()) if the dependencies are
///   added successfully, or an error if any part of the process fails.
///
/// # Errors
///
/// This function will return an error if:
/// * The root directory cannot be found
/// * There are issues reading or writing to package.json or package-tmpl.json
/// * Fetching the latest version of a package fails
///
/// # Example
///
/// ```
/// use khadim-rs::dependencies::add_dependencies;
///
/// let packages = vec!["package1", "package2"];
/// let result = add_dependencies(packages, false);
/// // Note: This test might fail in a CI environment without npm
/// // assert!(result.is_ok());
/// ```
pub fn add_dependencies(packages: Vec<&str>, is_dev: bool) -> Result<(), BoxError> {
    let root_dir = find_root_dir()?;
    let package_json_path = root_dir.join(PACKAGE_JSON);
    let package_tmpl_json_path = root_dir.join(PACKAGE_TMPL_JSON);

    // Read and parse package.json
    let package_json_content = fs::read_to_string(&package_json_path)?;
    let mut package_json: Value = serde_json::from_str(&package_json_content)?;

    // Read and parse package-tmpl.json
    let package_tmpl_json_content = fs::read_to_string(&package_tmpl_json_path)?;
    let mut package_tmpl_json: Value = serde_json::from_str(&package_tmpl_json_content)?;

    // Determine which dependency object to update
    let dep_key = if is_dev {
        "devDependencies"
    } else {
        "dependencies"
    };

    // Update package.json and package-tmpl.json
    for package in packages {
        let version = get_latest_version(package)?;
        let version_string = format!("^{}", version);

        if let Some(deps) = package_json[dep_key].as_object_mut() {
            deps.insert(package.to_string(), json!(version_string));
        } else {
            package_json[dep_key] = json!({ package: version_string });
        }

        if let Some(deps) = package_tmpl_json[dep_key].as_object_mut() {
            deps.insert(package.to_string(), json!(version_string));
        } else {
            package_tmpl_json[dep_key] = json!({ package: version_string });
        }

        println!("✅ Added {} {} to {} 📦", package, version_string, dep_key);
    }

    // Add concurrently as a dev dependency
    if !is_dev {
        let concurrently_version = get_latest_version("concurrently")?;
        if let Some(dev_deps) = package_json["devDependencies"].as_object_mut() {
            dev_deps.insert(
                "concurrently".to_string(),
                json!(format!("^{}", concurrently_version)),
            );
        } else {
            package_json["devDependencies"] =
                json!({ "concurrently": format!("^{}", concurrently_version) });
        }
        if let Some(dev_deps) = package_tmpl_json["devDependencies"].as_object_mut() {
            dev_deps.insert(
                "concurrently".to_string(),
                json!(format!("^{}", concurrently_version)),
            );
        } else {
            package_tmpl_json["devDependencies"] =
                json!({ "concurrently": format!("^{}", concurrently_version) });
        }
        println!(
            "✅ Added concurrently {} to devDependencies 📦",
            concurrently_version
        );
    }

    // Write updated package.json
    let updated_package_json = serde_json::to_string_pretty(&package_json)?;
    fs::write(package_json_path, updated_package_json)?;

    // Write updated package-tmpl.json
    let updated_package_tmpl_json = serde_json::to_string_pretty(&package_tmpl_json)?;
    fs::write(package_tmpl_json_path, updated_package_tmpl_json)?;

    // Run npm install
    run_npm_install(&root_dir)?;

    println!("✅ Dependencies added and installed successfully! 🎉");
    Ok(())
}

/// Retrieves the latest version of a specified npm package.
///
/// This function uses the `npm view` command to fetch the latest version
/// of the specified package from the npm registry.
///
/// # Arguments
///
/// * `package` - A string slice that holds the name of the npm package.
///
/// # Returns
///
/// * `Result<String, BoxError>` - A Result containing either:
///   - `Ok(String)`: The latest version of the package as a String.
///   - `Err(BoxError)`: An error if the version couldn't be retrieved.
///
/// # Errors
///
/// This function will return an error if:
/// * The `npm view` command fails to execute.
/// * The command output cannot be parsed as UTF-8.
/// * The npm registry returns an error for the specified package.
///
/// # Example
///
/// ```
/// use khadim-rs::dependencies::get_latest_version;
///
/// let result = get_latest_version("package_name");
/// assert!(result.is_ok());
/// ```
pub fn get_latest_version(package: &str) -> Result<String, BoxError> {
    let output = Command::new("npm")
        .args(&["view", package, "version"])
        .output()?;

    if output.status.success() {
        Ok(String::from_utf8(output.stdout)?.trim().to_string())
    } else {
        Err(format!("Failed to get latest version for {}", package).into())
    }
}

/// Finds the root directory of the project.
///
/// This function searches for the root directory by looking for the 'package-tmpl.json' file
/// in the current directory and its ancestors.
///
/// # Returns
///
/// * `Result<PathBuf, BoxError>` - The path to the root directory if found,
///   or an error if the root directory cannot be determined.
///
/// # Errors
///
/// This function will return an error if:
/// * The current directory cannot be determined
/// * The root directory (containing 'package-tmpl.json') is not found in the current directory or its ancestors
///
/// # Examples
///
/// ```
/// use khadim-rs::dependencies::find_root_dir;
///
/// let result = find_root_dir();
/// assert!(result.is_ok());
/// ```
pub fn find_root_dir() -> Result<PathBuf, BoxError> {
    let current_dir = std::env::current_dir()?;
    current_dir
        .ancestors()
        .find(|p| p.join(PACKAGE_TMPL_JSON).exists())
        .map(|p| p.to_path_buf())
        .ok_or_else(|| BoxError::from("❌ Cannot find root directory 😢"))
}

/// Runs `npm install` in the specified directory.
///
/// This function executes the `npm install` command in the given directory,
/// which installs all dependencies specified in the package.json file.
///
/// # Arguments
///
/// * `dir` - A reference to a `PathBuf` representing the directory where `npm install` should be run.
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
/// use khadim-rs::init::run_npm_install;
/// use std::path::Path;
///
/// let project_dir = Path::new(".");
/// let result = run_npm_install(&project_dir);
/// assert!(result.is_ok());
/// ```
fn run_npm_install(dir: &PathBuf) -> Result<(), BoxError> {
    println!("🛠️ Running npm install in {}...", dir.display());
    let output = Command::new("npm")
        .arg("install")
        .current_dir(dir)
        .output()?;

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

/// Adds a development dependency to the project's package.json and package-tmpl.json files.
///
/// This function adds the specified package as a development dependency to both
/// the package.json and package-tmpl.json files in the project's root directory.
/// It fetches the latest version of the package and adds it with a caret (^) prefix.
///
/// # Arguments
///
/// * `package` - A string slice representing the name of the package to be added.
///
/// # Returns
///
/// * `Result<(), BoxError>` - Ok(()) if the dependency is added successfully,
///   or an error if any part of the process fails.
///
/// # Errors
///
/// This function will return an error if:
/// * The root directory cannot be found
/// * There are issues reading or writing to package.json or package-tmpl.json
/// * Fetching the latest version of the package fails
///
/// # Example
///
/// ```
/// use khadim-rs::dependencies::add_dev_dependency;
///
/// let result = add_dev_dependency("jest");
/// assert!(result.is_ok());
/// ```
pub fn add_dev_dependency(package: &str) -> Result<(), BoxError> {
    let root_dir = find_root_dir()?;
    let package_json_path = root_dir.join(PACKAGE_JSON);
    let package_tmpl_json_path = root_dir.join(PACKAGE_TMPL_JSON);

    // Read and parse package.json
    let package_json_content = fs::read_to_string(&package_json_path)?;
    let mut package_json: Value = serde_json::from_str(&package_json_content)?;

    // Read and parse package-tmpl.json
    let package_tmpl_json_content = fs::read_to_string(&package_tmpl_json_path)?;
    let mut package_tmpl_json: Value = serde_json::from_str(&package_tmpl_json_content)?;

    let version = get_latest_version(package)?;
    let version_string = format!("^{}", version);

    // Update package.json
    if let Some(dev_deps) = package_json["devDependencies"].as_object_mut() {
        dev_deps.insert(package.to_string(), json!(version_string));
    } else {
        package_json["devDependencies"] = json!({ package: version_string });
    }

    // Update package-tmpl.json
    if let Some(dev_deps) = package_tmpl_json["devDependencies"].as_object_mut() {
        dev_deps.insert(package.to_string(), json!(version_string));
    } else {
        package_tmpl_json["devDependencies"] = json!({ package: version_string });
    }

    // Write updated package.json
    let updated_package_json = serde_json::to_string_pretty(&package_json)?;
    fs::write(package_json_path, updated_package_json)?;

    // Write updated package-tmpl.json
    let updated_package_tmpl_json = serde_json::to_string_pretty(&package_tmpl_json)?;
    fs::write(package_tmpl_json_path, updated_package_tmpl_json)?;

    println!(
        "✅ Added {} {} to devDependencies 📦",
        package, version_string
    );
    Ok(())
}
