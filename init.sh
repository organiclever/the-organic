#!/bin/bash

# Store the original directory
ORIGINAL_DIR=$(pwd)

# Navigate to the repository root (assuming init.sh is in the root)
cd "$(dirname "$0")"

# Navigate to the the-khadim directory
cd the-khadim

# Run the F# program with the --doctor flag
dotnet run -- --doctor

# Run the F# program with the --init flag
dotnet run -- --init

# Return to the original directory
cd "$ORIGINAL_DIR"

# Make the husky hooks executable

HOOKS_DIR=".husky"

for file in "$HOOKS_DIR"/*; do
  if [ -f "$file" ] && [ "$(basename "$file")" != "_" ] && [[ ! "$file" =~ \.(sample|md)$ ]]; then
    chmod +x "$file"
    echo "Made $file executable"
  fi
done

# Return to the original directory
cd "$ORIGINAL_DIR"

# Install Python dependencies
pip install -r requirements.txt
