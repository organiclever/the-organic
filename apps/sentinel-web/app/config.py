import json
from pathlib import Path
from typing import Dict, Union


DEFAULT_CONFIG: Dict[str, Union[int, str]] = {"port": 8000}


def load_config() -> Dict[str, Union[int, str]]:
    config_path: Path = Path(__file__).parent.parent / "config.json"
    try:
        with open(config_path, "r") as config_file:
            loaded_config: Dict[str, Union[int, str]] = json.load(config_file)
            return {**DEFAULT_CONFIG, **loaded_config}
    except FileNotFoundError:
        print(
            f"Configuration file not found at {
                config_path}. Using default configuration."
        )
        return DEFAULT_CONFIG
    except json.JSONDecodeError:
        print(
            f"Invalid JSON in configuration file at {
                config_path}. Using default configuration."
        )
        return DEFAULT_CONFIG


config: Dict[str, Union[int, str]] = load_config()
PORT: int = int(config["port"])
