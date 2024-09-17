#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    #[test]
    fn test_initialize_package_json() {
        let temp_dir = TempDir::new().expect("Failed to create temp directory");
        let root_path = temp_dir.path();

        println!("Temp directory created at {:?}", root_path);

        // Initialize package.json
        initialize_package_json(root_path).expect("Failed to initialize package.json");

        // Read the created package.json file
        let package_json_path = root_path.join("package.json");
        println!(
            "Attempting to read package.json from {:?}",
            package_json_path
        );

        let package_json_content = std::fs::read_to_string(&package_json_path).expect(&format!(
            "Failed to read package.json at {:?}",
            package_json_path
        ));

        println!("package.json content: {}", package_json_content);

        // Parse the JSON content
        let package_json: serde_json::Value = serde_json::from_str(&package_json_content)
            .expect("Failed to parse package.json content");

        // Assert that the required fields are present
        assert!(package_json.get("name").is_some(), "name field is missing");
        assert!(
            package_json.get("version").is_some(),
            "version field is missing"
        );
        assert!(
            package_json.get("private").is_some(),
            "private field is missing"
        );
        assert!(
            package_json.get("workspaces").is_some(),
            "workspaces field is missing"
        );
    }
}

use std::fs::File;
use std::io::Write;
use std::path::Path;

fn initialize_package_json(root_path: &Path) -> std::io::Result<()> {
    let package_json_path = root_path.join("package.json");
    println!(
        "Attempting to create package.json at {:?}",
        package_json_path
    );

    let mut file = File::create(&package_json_path).map_err(|e| {
        println!("Error creating file: {:?}", e);
        e
    })?;

    let content = r#"{
  "name": "your-project-name",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "libs/*"
  ]
}"#;

    file.write_all(content.as_bytes()).map_err(|e| {
        println!("Error writing to file: {:?}", e);
        e
    })?;

    println!("Successfully created package.json");
    Ok(())
}
