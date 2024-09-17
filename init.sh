#!/bin/bash

# Navigate to the repo-manager directory
cd repo-manager

# Run the Rust program
cargo run -- --doctor
cargo run -- --init

# Return to the original directory
cd ..
