import json
from pathlib import Path


def load_config():
    config_path = Path(__file__).parent / 'config.json'
    try:
        with open(config_path, 'r') as config_file:
            return json.load(config_file)
    except FileNotFoundError:
        raise FileNotFoundError(
            f"Configuration file not found at {config_path}")
    except json.JSONDecodeError:
        raise ValueError(
            f"Invalid JSON in configuration file at {config_path}")


config = load_config()
PORT = config.get('port', 8000)  # Default to 8000 if 'port' is not specified
