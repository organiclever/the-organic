use serde_json::{json, Value};
use std::fs;
use std::path::PathBuf;
use std::process::Command;

pub fn add_dependencies(
    packages: Vec<&str>,
    is_dev: bool,
) -> Result<(), Box<dyn std::error::Error>> {
    let root_dir = find_root_dir()?;
    let package_json_path = root_dir.join("package.json");
    let package_tmpl_json_path = root_dir.join("package-tmpl.json");

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

fn get_latest_version(package: &str) -> Result<String, Box<dyn std::error::Error>> {
    let output = Command::new("npm")
        .args(&["view", package, "version"])
        .output()?;

    if output.status.success() {
        Ok(String::from_utf8(output.stdout)?.trim().to_string())
    } else {
        Err(format!("Failed to get latest version for {}", package).into())
    }
}

fn find_root_dir() -> Result<PathBuf, Box<dyn std::error::Error>> {
    let current_dir = std::env::current_dir()?;
    current_dir
        .ancestors()
        .find(|p| p.join("package-tmpl.json").exists())
        .map(|p| p.to_path_buf())
        .ok_or_else(|| Box::<dyn std::error::Error>::from("❌ Cannot find root directory 😢"))
}

fn run_npm_install(dir: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
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

pub fn add_dev_dependency(package: &str) -> Result<(), Box<dyn std::error::Error>> {
    let root_dir = find_root_dir()?;
    let package_json_path = root_dir.join("package.json");
    let package_tmpl_json_path = root_dir.join("package-tmpl.json");

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
