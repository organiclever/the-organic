#!/bin/bash

# Store the original directory
ORIGINAL_DIR=$(pwd)

# Navigate to the repository root (assuming init.sh is in the root)
cd "$(dirname "$0")"

# Navigate to the mngr directory
cd mngr

# Run the F# program with the --doctor flag
dotnet run -- --doctor

# Run the F# program with the --init flag
dotnet run -- --init

# Return to the original directory
cd "$ORIGINAL_DIR"
