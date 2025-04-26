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

### 24-Hour MVP Architecture for AI-Powered Oncall Support Assistant

Given your specific requirements, I'll update the architecture to incorporate Gemini Pro, MCP server integration, and the ticket-based workflow.

### High-Level MVP Architecture

#### Core Components

1. **MCP Server Integration**
   - Lightweight connector to your existing local MCP server
   - Repository access layer for code retrieval and navigation
   - File content extraction and metadata handling

2. **Minimal FastAPI Backend**
   - Single API service with essential endpoints
   - Google Gemini Pro API integration for LLM capabilities
   - Context builder combining code, tickets, and knowledge

3. **Simple Chat Interface**
   - Lightweight React frontend with ticket input field
   - Support for pasting ticket details as context
   - Code snippet rendering with syntax highlighting

4. **Knowledge Base**
   - Local storage of stacktraces and documentation
   - Vector embeddings using SentenceTransformers (compatible with Gemini)
   - SQLite for persistent storage of embeddings

### Updated Data Flow

1. Engineer submits a question with ticket details as context via chat interface
2. System extracts relevant information from the ticket (error codes, services, etc.)
3. MCP server is queried to retrieve related code files and documentation
4. Context is assembled from ticket + repository + knowledge base
5. Gemini Pro generates response with references to specific files/solutions
6. Response is displayed to engineer with linked code snippets

## Technical Approach

```
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│                 │     │                     │     │                     │
│  Chat Interface │────▶│ FastAPI Backend     │────▶│ Google Gemini Pro   │
│  (React)        │     │ (Core Logic)        │     │ API                 │
│                 │◀────│                     │◀────│                     │
└─────────────────┘     └─────────────────────┘     └─────────────────────┘
                               │      ▲
                               │      │
                               ▼      │
          ┌───────────────────────────────────────┐
          │                                       │
          │ MCP Server                            │
          │ - Repository Access                   │
          │ - Code Search                         │
          │ - File Content Retrieval              │
          │                                       │
          └───────────────────────────────────────┘
                               │      ▲
                               │      │
                               ▼      │
          ┌───────────────────────────────────────┐
          │                                       │
          │ Local File System                     │
          │ - Cloned GitHub Repositories          │
          │ - Stacktraces                         │
          │ - Documentation                       │
          │                                       │
          └───────────────────────────────────────┘
```

## Implementation Plan (24 Hours)

### Hours 1-5: Setup & Core Infrastructure
- Set up Python FastAPI project with Gemini Pro API integration
- Create basic React frontend with ticket input and chat display
- Implement MCP server connector with essential repository access functions

### Hours 6-10: MCP & Repository Integration
- Develop file content retrieval from MCP server
- Implement code search and navigation capabilities
- Create repository context builder for LLM prompting

### Hours 11-15: Ticket Processing & Knowledge Base
- Build ticket information extractor (error codes, services, etc.)
- Implement basic vector storage for documentation and past issues
- Create context assembly combining ticket, code, and knowledge

### Hours 16-20: LLM Integration & Response Formatting
- Implement Gemini Pro prompt engineering for technical support
- Create response parser to extract code references and solutions
- Integrate code snippet formatting and linking

### Hours 21-24: Testing & Polish
- End-to-end testing with sample tickets and repositories
- Performance optimization for quick response times
- Documentation and demo preparation

## Technical Stack

- **Backend**: Python + FastAPI
- **Frontend**: React with simple chat UI
- **LLM**: Google Gemini Pro API
- **Vector Storage**: SentenceTransformers + SQLite
- **Repository Access**: MCP Server connector
- **Deployment**: Local development server for MVP demo

## Key Simplifications for 24-Hour Delivery

1. Limited repository navigation depth (focus on directly relevant files)
2. Simplified ticket parsing (extract key terms rather than full NLP)
3. Static knowledge base (pre-loaded rather than dynamically updated)
4. Limited authentication (basic API key handling)
5. Focused error handling on critical paths only

This architecture keeps your required components while maintaining feasibility for a 24-hour implementation. The MCP server integration provides the repository access you need, while Gemini Pro handles the LLM capabilities, and the ticket-based workflow guides the interaction model.

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
