#!/bin/bash

# Navigate to the repo-manager directory
cd repo-manager

# Build the release version
cargo build --release

# Move back to the root directory
cd ..

# Copy the built executable to the root directory
cp repo-manager/target/release/repo-manager ./repo-manager

# Clean up the target directory (optional)
rm -rf repo-manager/target

echo "repo-manager has been built and placed in the root directory."
