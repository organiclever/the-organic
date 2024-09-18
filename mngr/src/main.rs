mod dependencies;
mod doctor;
mod init;
mod reset;

use clap::{App, Arg};

fn main() {
    let result = run_app();
    if let Err(e) = result {
        eprintln!("❌ Error: {}", e);
        std::process::exit(1);
    }
}

/// Runs the main application logic.
///
/// This function sets up the command-line interface using `clap`, parses the arguments,
/// and executes the appropriate action based on the user's input.
///
/// # Returns
///
/// Returns `Ok(())` if the operation completes successfully, or an `Err` containing
/// a boxed dynamic error if an error occurs during execution.
///
/// # Errors
///
/// This function can return an error if any of the following operations fail:
/// - Initializing and installing dependencies
/// - Running doctor checks
/// - Resetting the project
/// - Adding dependencies
///
/// # Example
///
/// ```
/// fn main() {
///     if let Err(e) = run_app() {
///         eprintln!("Error: {}", e);
///         std::process::exit(1);
///     }
/// }
/// ```
fn run_app() -> Result<(), Box<dyn std::error::Error>> {
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
        .arg(
            Arg::with_name("deps")
                .long("deps")
                .help("Add dependencies to root package.json and package-tmpl.json 📦")
                .takes_value(true)
                .multiple(true),
        )
        .arg(
            Arg::with_name("deps-dev")
                .long("deps-dev")
                .help("Add dev dependencies to root package.json and package-tmpl.json 🛠️")
                .takes_value(true)
                .multiple(true),
        )
        .get_matches();

    match matches {
        m if m.is_present("init") => init::initialize_and_install_all()?,
        m if m.is_present("doctor") => doctor::run_doctor_checks()?,
        m if m.is_present("reset") => reset::reset_project()?,
        m if m.values_of("deps").is_some() => {
            let deps = m.values_of("deps").unwrap().collect();
            dependencies::add_dependencies(deps, false)?
        }
        m if m.values_of("deps-dev").is_some() => {
            let deps_dev = m.values_of("deps-dev").unwrap().collect();
            dependencies::add_dependencies(deps_dev, true)?
        }
        _ => {
            println!("🚀 Use --init to initialize package.json and install dependencies");
            println!("🩺 Use --doctor to check if volta, npm, and node are installed");
            println!("🔄 Use --reset to reset the project and reinstall dependencies");
            println!("📦 Use --deps <package-name> to add dependencies");
            println!("🛠️ Use --deps-dev <package-name> to add dev dependencies");
        }
    }

    Ok(())
}
