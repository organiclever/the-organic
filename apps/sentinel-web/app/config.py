import json
from pathlib import Path
from typing import Dict, Union, TypedDict, Literal


class ConfigDict(TypedDict):
    port: int
    db_path: str


DEFAULT_CONFIG: ConfigDict = {"port": 8000, "db_path": "./sentinel.db"}


def load_config() -> ConfigDict:
    config_path: Path = Path(__file__).parent.parent / "config.json"
    try:
        with open(config_path, "r") as config_file:
            loaded_config: Dict[str, Union[int, str]] = json.load(config_file)
            config: ConfigDict = {**DEFAULT_CONFIG, **loaded_config}  # type: ignore

            # Convert relative db_path to absolute path
            if "db_path" in config:
                db_path: Path = Path(config["db_path"]).expanduser()
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


config: ConfigDict = load_config()
PORT: Literal[8000, 8001] = config["port"]  # type: ignore
DB_PATH: str = config["db_path"]
