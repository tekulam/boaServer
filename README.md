# BoaServer - AI-Powered Oncall Support Assistant (MVP)

A lightweight AI assistant that helps engineers resolve operational tickets by providing context-aware support during oncall situations. This 24-hour MVP connects to code repositories via MCP server and leverages Google Gemini Pro for intelligent analysis.

## 📋 Overview

BoaServer assists engineers with troubleshooting by analyzing issue tickets and connecting them with relevant code in your repositories. The system uses MCP server for accessing repositories and Gemini Pro for AI capabilities to provide context-aware recommendations.

### Key Features

- **Issue Ticket Analysis**: Submit operational tickets to get relevant assistance
- **Repository Integration**: Connect to code via MCP server
- **AI-Powered Insights**: Leverage Google Gemini Pro for intelligent analysis
- **Code References**: Automatically find and display relevant code snippets
- **Simple Chat Interface**: Easy-to-use UI for quick issue resolution

## 🏗️ Architecture

The MVP uses a streamlined architecture focusing on core functionality:

- **FastAPI Backend**: Python-based API with Gemini Pro integration
- **React Frontend**: Simple chat interface with ticket input
- **MCP Server Connection**: Lightweight connector to access repositories
- **Google Gemini Pro**: AI capabilities for analyzing issues and code

## 🔄 Workflow

1. Engineer submits an issue ticket through the chat interface
2. System extracts key information from the ticket
3. MCP server is queried to find relevant code files
4. Context is assembled from ticket details and repository files
5. Gemini Pro generates a response with code references and solutions
6. Response is displayed with linked code snippets

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- [Poetry](https://python-poetry.org/docs/#installation) (for dependency management)
- Node.js 16+
- MCP Server running locally
- Google Gemini Pro API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/boaServer.git
cd boaServer

# Set up backend with Poetry
# Install Poetry if you haven't already:
# curl -sSL https://install.python-poetry.org | python3 -

# Install backend dependencies
poetry install

# Set up frontend
cd frontend
npm install
```

### Configuration

Create a `.env` file in the root directory with:

```
GEMINI_API_KEY=your_gemini_api_key
MCP_SERVER_URL=http://localhost:8080
MCP_SERVER_TOKEN=your_optional_token
```

### Running the Application

```bash
# Start the backend using Poetry
poetry run uvicorn app.main:app --reload
# Or use the Makefile shortcut
make run

# Start the frontend (in a new terminal)
cd frontend
npm start
```

## Using the Makefile

The project includes a Makefile for common development tasks:

```bash
# Install dependencies
make install

# Run tests
make test

# Run with test coverage
make test-cov

# Format code
make format

# Run linting
make lint

# Start the application
make run
```

## 📁 Repository Structure

```
boaServer/
├── backend/                  # Python FastAPI backend
│   ├── app/
│   │   ├── main.py           # FastAPI application entry point
│   │   ├── api/              # API endpoints
│   │   ├── core/             # Core configuration
│   │   ├── mcp/              # MCP server integration
│   │   ├── llm/              # Gemini API integration
│   │   └── utils/            # Utility functions
│   └── tests/                # Test cases
│
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── services/         # API services
│   │   └── styles/           # CSS styles
│   └── package.json          # Node dependencies
│
├── docs/                     # Documentation
│   ├── design/               # Design documents
│   └── diagrams/             # Architecture diagrams
│
├── config/                   # Configuration files
├── pyproject.toml            # Poetry configuration
├── Makefile                  # Development tasks
└── README.md                 # Project documentation
```

## 🛠️ Development Notes

This project is an MVP developed in 24 hours. Code quality focuses on functionality over perfection. Areas for future improvement include:

- Knowledge base integration for historical issues
- Better error handling and edge cases
- Extended repository analysis capabilities
- Authentication and multi-user support

## Testing

Run the test suite using pytest via Poetry:

```bash
# Run all tests
poetry run pytest

# Run with coverage report
poetry run pytest --cov=app tests/
```

## 📝 License

[MIT License](LICENSE)

## 🙏 Acknowledgements

- Google Gemini Pro for AI capabilities
- FastAPI for the backend framework
- Poetry for Python dependency management
- React for the frontend library
