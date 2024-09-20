use crate::config::{APPS_DIR, LIBS_DIR, PACKAGE_JSON};
use crate::init;
use crate::BoxError;
use rayon::prelude::*;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;

/// Resets the project by removing existing configuration and dependencies,
/// then reinitializing the project.
///
/// This function performs the following steps:
/// 1. Finds the root directory of the project.
/// 2. Deletes the package.json file if it exists.
/// 3. Removes node_modules directories from the root, apps (APPS_DIR), and libs (LIBS_DIR) directories in parallel.
/// 4. Recreates the package.json file and reinstalls all dependencies.
///
/// # Returns
///
/// * `Result<(), BoxError>` - Ok(()) if the reset is successful,
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
/// use mngr-rs::reset::reset_project;
///
/// let result = reset_project();
/// assert!(result.is_ok());
/// ```

/// ```
/// use mngr-rs::reset::delete_node_modules;
/// use std::path::Path;
///
/// let project_dir = Path::new(".");
/// let result = delete_node_modules(project_dir);
/// assert!(result.is_ok());
/// ```
pub fn reset_project() -> Result<(), BoxError> {
    println!("🔄 Resetting project...");
    let root_dir = find_root_dir()?;

    // Delete package.json
    if Path::new(PACKAGE_JSON).exists() {
        fs::remove_file(PACKAGE_JSON)?;
        println!("Removed {}", PACKAGE_JSON);
    }

    // Delete node_modules in root, apps, and libs in parallel
    let dirs_to_clean = vec![
        root_dir.clone(),
        root_dir.join(APPS_DIR),
        root_dir.join(LIBS_DIR),
    ];

    let cpu_count = num_cpus::get();
    let max_workers = std::cmp::max(1, cpu_count - 1); // Use all cores except one
    println!(
        "🚀 Deleting node_modules in parallel (max {} workers)",
        max_workers
    );

    let pool = rayon::ThreadPoolBuilder::new()
        .num_threads(max_workers)
        .build()
        .map_err(BoxError::from)?;

    let completed_count = Arc::new(AtomicUsize::new(0));
    let total_count = Arc::new(AtomicUsize::new(dirs_to_clean.len()));

    pool.install(|| {
        dirs_to_clean.par_iter().for_each(|dir| {
            if let Err(e) = delete_node_modules(dir) {
                eprintln!("Error deleting node_modules in {}: {}", dir.display(), e);
            }
            let completed = completed_count.fetch_add(1, Ordering::SeqCst) + 1;
            let total = total_count.load(Ordering::SeqCst);
            println!("Progress: {}/{} directories cleaned", completed, total);
        });
    });

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
/// use mngr-rs::reset::find_root_dir;
///
/// fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
///     match find_root_dir() {
///         Ok(root_dir) => println!("Root directory found: {}", root_dir.display()),
///         Err(e) => eprintln!("Failed to find root directory: {}", e),
///     }
///     Ok(())
/// }
/// ```
pub fn find_root_dir() -> Result<PathBuf, BoxError> {
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
/// * `Result<(), BoxError>` - Ok(()) if all operations are successful,
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
/// use mngr-rs::reset::delete_node_modules;
///
/// let project_dir = Path::new("/path/to/project");
/// let result = delete_node_modules(project_dir);
/// assert!(result.is_ok());
/// ```
pub fn delete_node_modules(dir: &Path) -> Result<(), BoxError> {
    let node_modules = dir.join("node_modules");
    if node_modules.exists() {
        fs::remove_dir_all(&node_modules)?;
        println!("✅ Deleted node_modules in {} 🗑️", dir.display());
    }

    // Recursively delete node_modules in subdirectories
    if dir.is_dir() {
        dir.read_dir()?
            .par_bridge()
            .try_for_each(|entry| -> Result<(), BoxError> {
                let entry = entry?;
                let path = entry.path();
                if path.is_dir() && path.file_name() != Some(std::ffi::OsStr::new("node_modules")) {
                    delete_node_modules(&path)?;
                }
                Ok(())
            })?;
    }

    Ok(())
}
