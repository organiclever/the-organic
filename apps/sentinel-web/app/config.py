import json
from pathlib import Path
from typing import Dict, Union, TypedDict, Literal
import os
from dotenv import load_dotenv

load_dotenv()


class ConfigDict(TypedDict):
    port: int
    db_path: str
    db_path_backup: str


DEFAULT_CONFIG: ConfigDict = {
    "port": 8000,
    "db_path": "./sentinel.db",
    "db_path_backup": "./sentinel_backup.db",
}


def load_config() -> ConfigDict:
    config_path: Path = Path(__file__).parent.parent / "config.json"
    try:
        with open(config_path, "r") as config_file:
            loaded_config: Dict[str, Union[int, str]] = json.load(config_file)
            config: ConfigDict = {**DEFAULT_CONFIG, **loaded_config}  # type: ignore

            # Convert relative db_path and db_path_backup to absolute paths
            for key in ["db_path", "db_path_backup"]:
                if key in config:
                    path = Path(config[key]).expanduser()
                    if not path.is_absolute():
                        path = (config_path.parent / path).resolve()
                    config[key] = str(path)

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


config: ConfigDict = load_config()
PORT: Literal[8000, 8001] = config["port"]  # type: ignore
DB_PATH: str = config["db_path"]
DB_PATH_BACKUP: str = config["db_path_backup"]
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
