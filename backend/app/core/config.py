"""
Configuration management module for BoaServer.
"""

from functools import lru_cache
from pydantic import BaseSettings, validator
from typing import Optional, Dict, Any, List
import os
from pathlib import Path


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    
    # API keys and secrets
    GEMINI_API_KEY: str
    
    # MCP server configuration
    MCP_SERVER_URL: str
    MCP_SERVER_TOKEN: Optional[str] = None
    
    # LLM configuration
    LLM_MODEL: str = "gemini-pro"
    LLM_TEMPERATURE: float = 0.2
    LLM_MAX_TOKENS: int = 1024
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    @validator("LOG_LEVEL")
    def validate_log_level(cls, v: str) -> str:
        """Validate that the log level is valid."""
        allowed_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v not in allowed_levels:
            return "INFO"
        return v
    
    class Config:
        """Pydantic config."""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get application settings with caching."""
    return Settings()


def get_project_root() -> Path:
    """Get the project root directory."""
    return Path(__file__).parent.parent.parent.parent
