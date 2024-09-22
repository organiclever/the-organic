use crate::BoxError;
use std::process::Command;

/// Runs a series of checks to ensure the development environment is properly set up.
///
/// This function checks for the presence and correct installation of essential tools:
/// - Volta (JavaScript toolchain manager)
/// - npm (Node.js package manager)
/// - Node.js (JavaScript runtime)
///
/// # Returns
///
/// Returns `Ok(())` if all checks pass or if some checks fail but the function completes.
/// The actual success or failure of individual checks is communicated through console output.
///
/// # Errors
///
/// This function will return an `Err` if there's an unexpected error during the execution
/// of any check. However, missing tools or version check failures are not considered errors
/// at this level and are instead reported through the console output.
///
/// # Example
///
/// ```
/// use khadim-rs::doctor::run_doctor_checks;
///
/// let result = run_doctor_checks();
/// assert!(result.is_ok());
/// ```
pub fn run_doctor_checks() -> Result<(), BoxError> {
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

/// Checks if a command is available and retrieves its version.
///
/// This function attempts to execute a given command with specified arguments,
/// typically to check its version. It then interprets the result and provides
/// appropriate console output.
///
/// # Arguments
///
/// * `command` - A string slice that holds the name of the command to check.
/// * `args` - A slice of string slices containing the arguments to pass to the command.
///
/// # Returns
///
/// Returns a `Result<bool, Box<dyn std::error::Error>>`:
/// - `Ok(true)` if the command is installed and executed successfully.
/// - `Ok(false)` if the command failed to execute or is not installed.
/// - `Err(...)` if there was an unexpected error during the process.
///
/// # Examples
///
/// ```
/// use khadim-rs::doctor::check_command;
///
/// let result = check_command("node", &["--version"]);
/// assert!(result.is_ok());
/// ```
pub fn check_command(command: &str, args: &[&str]) -> Result<bool, BoxError> {
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
