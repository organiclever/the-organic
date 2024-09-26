#!/bin/bash

# Check if Python is installed
if ! command -v python &>/dev/null; then
  echo "Python could not be found. Please install Python and try again."
  exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "sentinel-web" ]; then
  python -m venv sentinel-web
fi

# Activate virtual environment
source sentinel-web/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install Python dependencies
pip install -r requirements.txt

echo "Python setup complete. Virtual environment 'sentinel-web' is created and activated."
