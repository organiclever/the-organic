use crate::config::{APPS_DIR, LIBS_DIR, PACKAGE_JSON};
use crate::init;
use crate::BoxError;
use std::fs;
use std::path::{Path, PathBuf};

/// Resets the project by removing existing configuration and dependencies,
/// then reinitializing the project.
///
/// This function performs the following steps:
/// 1. Finds the root directory of the project.
/// 2. Deletes the package.json file if it exists.
/// 3. Removes node_modules directories from the root, apps (APPS_DIR), and libs (LIBS_DIR) directories.
/// 4. Recreates the package.json file and reinstalls all dependencies.
///
/// # Returns
///
/// * `Result<(), Box<dyn std::error::Error>>` - Ok(()) if the reset is successful,
///   or an error if any step fails.
///
/// # Errors
///
/// This function will return an error if:
/// * The root directory cannot be found
/// * Deleting files or directories fails
/// * Reinitializing the project fails
///
/// # Examples
///
/// ```
/// match reset_project() {
///     Ok(()) => println!("Project reset successfully"),
///     Err(e) => eprintln!("Failed to reset project: {}", e),
/// }
/// ```
pub fn reset_project() -> Result<(), BoxError> {
    println!("🔄 Resetting project...");
    let root_dir = find_root_dir()?;

    // Delete package.json
    if Path::new(PACKAGE_JSON).exists() {
        fs::remove_file(PACKAGE_JSON)?;
        println!("Removed {}", PACKAGE_JSON);
    }

    // Delete node_modules in root, apps, and libs
    delete_node_modules(&root_dir)?;
    delete_node_modules(&root_dir.join(APPS_DIR))?;
    delete_node_modules(&root_dir.join(LIBS_DIR))?;

    // Recreate package.json and install dependencies
    init::initialize_and_install_all()?;

    println!("✅ Project reset completed successfully! 🎉");
    Ok(())
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
/// use mngr::reset::find_root_dir;
///
/// fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
///     match find_root_dir() {
///         Ok(root_dir) => println!("Root directory found: {}", root_dir.display()),
///         Err(e) => eprintln!("Failed to find root directory: {}", e),
///     }
///     Ok(())
/// }
/// ```
fn find_root_dir() -> Result<PathBuf, BoxError> {
    let current_dir = std::env::current_dir()?;
    current_dir
        .ancestors()
        .find(|p| p.join("package-tmpl.json").exists())
        .map(|p| p.to_path_buf())
        .ok_or_else(|| BoxError::from("❌ Cannot find root directory 😢"))
}

/// Recursively deletes 'node_modules' directories within the given directory and its subdirectories.
///
/// This function performs the following actions:
/// 1. Deletes the 'node_modules' directory in the given directory, if it exists.
/// 2. Recursively searches for and deletes 'node_modules' directories in all subdirectories.
///
/// # Arguments
///
/// * `dir` - A reference to a `Path` representing the directory to start the deletion process from.
///
/// # Returns
///
/// * `Result<(), Box<dyn std::error::Error>>` - Ok(()) if all operations are successful,
///   or an error if any deletion fails.
///
/// # Errors
///
/// This function will return an error if:
/// * There's a problem accessing or reading the directory
/// * Deleting a 'node_modules' directory fails
/// * Recursing into subdirectories encounters any issues
///
/// # Examples
///
/// ```
/// use std::path::Path;
///
/// let project_dir = Path::new("/path/to/project");
/// match delete_node_modules(project_dir) {
///     Ok(()) => println!("Successfully deleted all node_modules directories"),
///     Err(e) => eprintln!("Error deleting node_modules: {}", e),
/// }
/// ```
fn delete_node_modules(dir: &Path) -> Result<(), BoxError> {
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
