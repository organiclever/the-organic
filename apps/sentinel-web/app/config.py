import json
from pathlib import Path
from typing import Dict, Union
import os


DEFAULT_CONFIG: Dict[str, Union[int, str]] = {"port": 8000, "db_path": "./sentinel.db"}


def load_config() -> Dict[str, Union[int, str]]:
    config_path: Path = Path(__file__).parent.parent / "config.json"
    try:
        with open(config_path, "r") as config_file:
            loaded_config: Dict[str, Union[int, str]] = json.load(config_file)
            config = {**DEFAULT_CONFIG, **loaded_config}

            # Convert relative db_path to absolute path
            if "db_path" in config:
                db_path = str(config["db_path"])  # Ensure db_path is a string
                db_path = os.path.expanduser(db_path)
                db_path = Path(db_path)
                if not db_path.is_absolute():
                    db_path = (config_path.parent / db_path).resolve()
                config["db_path"] = str(db_path)

            return config
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
DB_PATH: str = str(config["db_path"])
