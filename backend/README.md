# BoaServer Backend

The Python FastAPI backend for the BoaServer AI-powered oncall support assistant.

## Setup with Poetry

This project uses Poetry for dependency management. Follow these steps to set up the development environment:

### Prerequisites

- Python 3.9+
- [Poetry](https://python-poetry.org/docs/#installation)
- MCP Server running locally
- Google Gemini Pro API key

### Installation

1. Install Poetry:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Install dependencies:
```bash
# Navigate to the project root (where pyproject.toml is located)
cd /path/to/boaServer
poetry install
```

3. Configure environment variables:
```bash
# Create a .env file in the root directory
echo "GEMINI_API_KEY=your_gemini_api_key" > .env
echo "MCP_SERVER_URL=http://localhost:8080" >> .env
```

### Running the Application

```bash
# Activate the virtual environment
poetry shell

# Run the FastAPI application
uvicorn app.main:app --reload
```

### Development Commands

```bash
# Format code
poetry run black .
poetry run isort .

# Lint code
poetry run ruff .
poetry run mypy .

# Run tests
poetry run pytest
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application entry point
│   ├── api/              # API endpoints
│   ├── core/             # Core configuration
│   ├── mcp/              # MCP server integration
│   ├── llm/              # Gemini API integration
│   └── utils/            # Utility functions
│
├── tests/                # Test cases
├── pyproject.toml        # Poetry configuration
└── README.md             # Backend documentation
```
