import pytest
from unittest.mock import patch
from app.database import backup_database, restore_database
from app.config import DB_PATH, DB_PATH_BACKUP


@pytest.fixture
def mock_shutil():
    with patch("app.database.shutil") as mock:
        yield mock


@pytest.fixture
def mock_logger():
    with patch("app.database.logger") as mock:
        yield mock


def test_backup_database_success(mock_shutil, mock_logger):
    # Arrange
    mock_shutil.copy2.return_value = None

    # Act
    success, result = backup_database()

    # Assert
    assert success is True
    assert isinstance(result, str)
    mock_shutil.copy2.assert_called_once_with(DB_PATH, DB_PATH_BACKUP)
    mock_logger.info.assert_called()


def test_backup_database_failure(mock_shutil, mock_logger):
    # Arrange
    mock_shutil.copy2.side_effect = Exception("Backup failed")

    # Act
    success, result = backup_database()

    # Assert
    assert success is False
    assert isinstance(result, str)
    assert "Error in backup_database" in result
    mock_shutil.copy2.assert_called_once_with(DB_PATH, DB_PATH_BACKUP)
    mock_logger.error.assert_called()


def test_restore_database_success(mock_shutil, mock_logger):
    # Arrange
    mock_shutil.copy2.return_value = None

    # Act
    success, result = restore_database()

    # Assert
    assert success is True
    assert isinstance(result, str)
    mock_shutil.copy2.assert_called_once_with(DB_PATH_BACKUP, DB_PATH)
    mock_logger.info.assert_called()


def test_restore_database_failure(mock_shutil, mock_logger):
    # Arrange
    mock_shutil.copy2.side_effect = Exception("Restore failed")

    # Act
    success, result = restore_database()

    # Assert
    assert success is False
    assert isinstance(result, str)
    assert "Error in restore_database" in result
    mock_shutil.copy2.assert_called_once_with(DB_PATH_BACKUP, DB_PATH)
    mock_logger.error.assert_called()
