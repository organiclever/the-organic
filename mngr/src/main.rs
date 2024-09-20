mod config;
mod dependencies;
mod doctor;
mod init;
mod reset;

use clap::{App, Arg};
use std::process;

// Add this line to import the constant
use crate::config::PACKAGE_TMPL_JSON;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let reset_help = format!(
        "Reset the project: delete package.json and node_modules, then reinitialize using {}",
        PACKAGE_TMPL_JSON
    );

    let matches = App::new("Repo Manager")
        .version("1.0")
        .author("Your Name")
        .about("Manages repositories")
        .arg(
            Arg::with_name("init")
                .long("init")
                .help("Initialize package.json, run npm install, and install project dependencies")
                .takes_value(false),
        )
        .arg(
            Arg::with_name("doctor")
                .long("doctor")
                .help("Check if volta, npm, and node are installed")
                .takes_value(false),
        )
        .arg(
            Arg::with_name("reset")
                .long("reset")
                .help(reset_help.as_str())
                .takes_value(false),
        )
        .arg(
            Arg::with_name("deps")
                .long("deps")
                .help("Add dependencies to root package.json and package-tmpl.json")
                .takes_value(true)
                .multiple(true),
        )
        .arg(
            Arg::with_name("deps-dev")
                .long("deps-dev")
                .help("Add dev dependencies to root package.json and package-tmpl.json")
                .takes_value(true)
                .multiple(true),
        )
        .get_matches();

    if matches.is_present("init") {
        match init::initialize_and_install_all() {
            Ok(_) => println!("Initialization completed successfully."),
            Err(e) => {
                eprintln!("Error during initialization: {}", e);
                process::exit(1);
            }
        }
    } else if matches.is_present("doctor") {
        match doctor::run_doctor_checks() {
            Ok(_) => println!("Doctor checks passed successfully."),
            Err(e) => {
                eprintln!("Doctor checks failed: {}", e);
                process::exit(1);
            }
        }
    } else if matches.is_present("reset") {
        match reset::reset_project() {
            Ok(_) => println!("Reset completed successfully."),
            Err(e) => {
                eprintln!("Error during reset: {}", e);
                process::exit(1);
            }
        }
    } else {
        match matches.values_of("deps") {
            Some(deps) => {
                let deps: Vec<&str> = deps.collect();
                dependencies::add_dependencies(deps, false)?;
            }
            None => match matches.values_of("deps-dev") {
                Some(deps_dev) => {
                    let deps_dev: Vec<&str> = deps_dev.collect();
                    dependencies::add_dependencies(deps_dev, true)?;
                }
                None => {
                    println!("No valid option provided. Use --help for usage information.");
                    process::exit(1);
                }
            },
        }
    }

    Ok(())
}
