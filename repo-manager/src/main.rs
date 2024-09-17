use clap::{App, Arg};
use serde_json::{json, Value};
use std::env;
use std::fs;
use std::path::Path;

fn main() {
    let matches = App::new("Repo Manager")
        .version("1.0")
        .author("Your Name")
        .about("Manages repositories")
        .arg(
            Arg::with_name("init")
                .long("init")
                .help("Initialize package.json from template")
                .takes_value(false),
        )
        .get_matches();

    if matches.is_present("init") {
        if let Err(e) = initialize_package_json() {
            eprintln!("Error initializing package.json: {}", e);
        }
    } else {
        println!("Use --init to initialize package.json");
    }
}

fn initialize_package_json() -> Result<(), Box<dyn std::error::Error>> {
    let current_dir = env::current_dir()?;
    let root_dir = current_dir
        .ancestors()
        .nth(1)
        .ok_or("Cannot find root directory")?;

    let template_path = root_dir.join("package-tmpl.json");
    let output_path = root_dir.join("package.json");

    if !template_path.exists() {
        return Err(format!("package-tmpl.json not found in {}", root_dir.display()).into());
    }

    let template_content = fs::read_to_string(&template_path)?;
    let mut template: Value = serde_json::from_str(&template_content)?;

    let mut scripts = json!({});
    merge_scripts(
        &mut scripts,
        root_dir.join("apps/ayokoding-web/package.json"),
        "ayokoding-web",
    )?;
    merge_scripts(
        &mut scripts,
        root_dir.join("apps/organic-lever-web/package.json"),
        "organic-lever-web",
    )?;
    merge_scripts(
        &mut scripts,
        root_dir.join("apps/organic-lever-web-e2e/package.json"),
        "organic-lever-web-e2e",
    )?;
    merge_scripts(
        &mut scripts,
        root_dir.join("libs/hello/package.json"),
        "libs",
    )?;

    template["scripts"] = scripts;

    let output_content = serde_json::to_string_pretty(&template)?;
    fs::write(output_path, output_content)?;

    println!("Successfully created package.json in the root directory");
    Ok(())
}

fn merge_scripts(
    scripts: &mut Value,
    file_path: impl AsRef<Path>,
    prefix: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let file_path = file_path.as_ref();
    if !file_path.exists() {
        println!("Warning: {} not found, skipping", file_path.display());
        return Ok(());
    }

    let content = fs::read_to_string(file_path)?;
    let package: Value = serde_json::from_str(&content)?;

    if let Some(package_scripts) = package["scripts"].as_object() {
        for (key, value) in package_scripts {
            let new_key = format!("{}:{}", prefix, key);
            let parent_path = file_path.parent().ok_or("Invalid file path")?;
            scripts[new_key] = json!(format!("cd {} && {}", parent_path.display(), value));
        }
    }

    Ok(())
}
