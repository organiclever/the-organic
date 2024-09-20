// Add this to expose the modules for testing
pub mod config;
pub mod dependencies;
pub mod doctor;
pub mod init;
pub mod reset;

// Add this line to define BoxError at the crate level
pub type BoxError = Box<dyn std::error::Error + Send + Sync>;
