import json
from pathlib import Path


DEFAULT_CONFIG = {
    'port': 8000
}


def load_config():
    config_path = Path(__file__).parent.parent / 'config.json'
    try:
        with open(config_path, 'r') as config_file:
            loaded_config = json.load(config_file)
            return {**DEFAULT_CONFIG, **loaded_config}
    except FileNotFoundError:
        print(f"Configuration file not found at {
              config_path}. Using default configuration.")
        return DEFAULT_CONFIG
    except json.JSONDecodeError:
        print(f"Invalid JSON in configuration file at {
              config_path}. Using default configuration.")
        return DEFAULT_CONFIG


config = load_config()
PORT = config['port']
