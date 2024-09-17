use std::process::Command;

pub fn run_doctor_checks() -> Result<(), Box<dyn std::error::Error>> {
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
