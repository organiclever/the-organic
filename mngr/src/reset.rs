use std::fs;
use std::path::{Path, PathBuf};
use crate::init;

pub fn reset_project() -> Result<(), Box<dyn std::error::Error>> {
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
    init::initialize_and_install_all()?;

    println!("✅ Project reset completed successfully! 🎉");
    Ok(())
}

fn find_root_dir() -> Result<PathBuf, Box<dyn std::error::Error>> {
    let current_dir = std::env::current_dir()?;
    current_dir
        .ancestors()
        .find(|p| p.join("package-tmpl.json").exists())
        .map(|p| p.to_path_buf())
        .ok_or_else(|| Box::<dyn std::error::Error>::from("❌ Cannot find root directory 😢"))
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