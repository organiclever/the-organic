use clap::{App, Arg};
use serde_json::{json, Value};
use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

fn main() {
    let matches = App::new("Repo Manager 🛠️")
        .version("1.0")
        .author("Your Name")
        .about("Manages repositories 📁")
        .arg(
            Arg::with_name("init")
                .long("init")
                .help(
                    "Initialize package.json, run npm install, and install project dependencies 🚀",
                )
                .takes_value(false),
        )
        .arg(
            Arg::with_name("doctor")
                .long("doctor")
                .help("Check if volta, npm, and node are installed 🩺")
                .takes_value(false),
        )
        .arg(
            Arg::with_name("reset")
                .long("reset")
                .help(
                    "Reset the project: delete package.json and node_modules, then reinitialize 🔄",
                )
                .takes_value(false),
        )
        .get_matches();

    if matches.is_present("init") {
        if let Err(e) = initialize_and_install_all() {
            eprintln!("❌ Error: {}", e);
        }
    } else if matches.is_present("doctor") {
        if let Err(e) = run_doctor_checks() {
            eprintln!("❌ Error during doctor checks: {}", e);
        }
    } else if matches.is_present("reset") {
        if let Err(e) = reset_project() {
            eprintln!("❌ Error during project reset: {}", e);
        }
    } else {
        println!("🚀 Use --init to initialize package.json and install dependencies");
        println!("🩺 Use --doctor to check if volta, npm, and node are installed");
        println!("🔄 Use --reset to reset the project and reinstall dependencies");
    }
}

fn run_doctor_checks() -> Result<(), Box<dyn std::error::Error>> {
    println!("🩺 Running doctor checks...");
    let mut all_checks_passed = true;

    all_checks_passed &= check_command("volta", &["--version"])?;
    all_checks_passed &= check_command("npm", &["--version"])?;
    all_checks_passed &= check_command("node", &["--version"])?;

    if all_checks_passed {
        println!("\n✅ All checks passed successfully! 🎉");
    } else {
        println!("\n❌ Some checks failed. Please install the missing tools. 🛠️");
    }

    Ok(())
}

fn check_command(command: &str, args: &[&str]) -> Result<bool, Box<dyn std::error::Error>> {
    match Command::new(command).args(args).output() {
        Ok(output) => {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
                println!("✅ {} is installed. Version: {} 🚀", command, version);
                Ok(true)
            } else {
                println!("❌ {} check failed 😕", command);
                Ok(false)
            }
        }
        Err(_) => {
            println!("❌ {} is not installed or not in PATH 😢", command);
            Ok(false)
        }
    }
}

fn initialize_and_install_all() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 Initializing and installing all dependencies...");
    let root_dir = initialize_package_json()?;
    run_npm_install(&root_dir)?;
    install_project_dependencies(&root_dir)?;
    println!("✅ All dependencies installed successfully! 🎉");
    Ok(())
}

fn initialize_package_json() -> Result<PathBuf, Box<dyn std::error::Error>> {
    println!("📦 Initializing package.json...");
    let current_dir = env::current_dir()?;
    let root_dir = current_dir
        .ancestors()
        .nth(1)
        .ok_or("❌ Cannot find root directory 😢")?
        .to_path_buf();

    let template_path = root_dir.join("package-tmpl.json");
    let output_path = root_dir.join("package.json");

    if !template_path.exists() {
        return Err(format!("❌ package-tmpl.json not found in {}", root_dir.display()).into());
    }

    let template_content = fs::read_to_string(&template_path)?;
    let mut template: Value = serde_json::from_str(&template_content)?;

    let mut scripts = json!({});
    merge_scripts(
        &mut scripts,
        &root_dir,
        "apps/ayokoding-web/package.json",
        "ayokoding-web",
    )?;
    merge_scripts(
        &mut scripts,
        &root_dir,
        "apps/organic-lever-web/package.json",
        "organic-lever-web",
    )?;
    merge_scripts(
        &mut scripts,
        &root_dir,
        "apps/organic-lever-web-e2e/package.json",
        "organic-lever-web-e2e",
    )?;
    merge_scripts(&mut scripts, &root_dir, "libs/hello/package.json", "libs")?;

    template["scripts"] = scripts;

    let output_content = serde_json::to_string_pretty(&template)?;
    fs::write(output_path, output_content)?;

    println!("✅ Successfully created package.json in the root directory 📄");
    Ok(root_dir)
}

fn merge_scripts(
    scripts: &mut Value,
    root_dir: &Path,
    relative_path: &str,
    prefix: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let file_path = root_dir.join(relative_path);
    if !file_path.exists() {
        println!("⚠️ {} not found, skipping", relative_path);
        return Ok(());
    }

    let content = fs::read_to_string(&file_path)?;
    let package: Value = serde_json::from_str(&content)?;

    if let Some(package_scripts) = package["scripts"].as_object() {
        for (key, value) in package_scripts {
            let new_key = format!("{}:{}", prefix, key);
            let parent_path = Path::new(relative_path)
                .parent()
                .ok_or("❌ Invalid file path 😢")?;
            scripts[new_key] = json!(format!(
                "cd {} && {}",
                parent_path.display(),
                value.as_str().unwrap_or("")
            ));
        }
    }

    Ok(())
}

fn install_project_dependencies(root_dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
    println!("📚 Installing project dependencies...");
    let apps_dir = root_dir.join("apps");
    let libs_dir = root_dir.join("libs");

    install_dependencies_in_dir(&apps_dir)?;
    install_dependencies_in_dir(&libs_dir)?;

    println!("✅ All project dependencies installed successfully! 🎉");
    Ok(())
}

fn install_dependencies_in_dir(dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
    if dir.is_dir() {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                install_project_if_npm(&path)?;
            }
        }
    }
    Ok(())
}

fn install_project_if_npm(project_dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
    let package_json_path = project_dir.join("package.json");
    if package_json_path.exists() {
        let content = fs::read_to_string(&package_json_path)?;
        let package: Value = serde_json::from_str(&content)?;

        if let Some(project_info) = package.get("project") {
            if let Some(kind) = project_info.get("kind") {
                if kind == "npm" {
                    println!(
                        "📦 Installing dependencies for {} 🚀",
                        project_dir.display()
                    );
                    run_npm_install(project_dir)?;
                }
            }
        }
    }
    Ok(())
}

fn run_npm_install(dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
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

fn reset_project() -> Result<(), Box<dyn std::error::Error>> {
    println!("🔄 Resetting project...");
    let root_dir = find_root_dir()?;

    // Delete package.json
    let package_json_path = root_dir.join("package.json");
    if package_json_path.exists() {
        fs::remove_file(&package_json_path)?;
        println!("✅ Deleted package.json 🗑️");
    }

    // Delete node_modules in root, apps, and libs
    delete_node_modules(&root_dir)?;
    delete_node_modules(&root_dir.join("apps"))?;
    delete_node_modules(&root_dir.join("libs"))?;

    // Recreate package.json and install dependencies
    initialize_and_install_all()?;

    println!("✅ Project reset completed successfully! 🎉");
    Ok(())
}

fn find_root_dir() -> Result<PathBuf, Box<dyn std::error::Error>> {
    println!("🔍 Finding root directory...");
    let current_dir = env::current_dir()?;
    current_dir
        .ancestors()
        .find(|p| p.join("package-tmpl.json").exists())
        .ok_or_else(|| "❌ Cannot find root directory 😢".into())
        .map(|p| p.to_path_buf())
}

fn delete_node_modules(dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
    let node_modules = dir.join("node_modules");
    if node_modules.exists() {
        fs::remove_dir_all(&node_modules)?;
        println!("✅ Deleted node_modules in {} 🗑️", dir.display());
    }

    // Recursively delete node_modules in subdirectories
    if dir.is_dir() {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() && path.file_name() != Some(std::ffi::OsStr::new("node_modules")) {
                delete_node_modules(&path)?;
            }
        }
    }

    Ok(())
}
