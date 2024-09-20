#!/bin/bash

# Navigate to the mngr-rs directory
cd mngr-rs

# Run the Rust program
cargo run -- --doctor
cargo run -- --init

# Return to the original directory
cd ..
