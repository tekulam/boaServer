# BoaServer - AI-Powered Oncall Support Assistant

A comprehensive AI assistant that helps engineers troubleshoot, analyze, and resolve operational incidents. BoaServer connects to code repositories, documentation, and ticketing systems to provide context-aware support during oncall situations.

## Key Features

- **Intelligent Chatbot Interface**: Web-based and Slack-integrated chat interface for engineers
- **LLM-Powered Analysis**: Advanced AI capabilities for understanding and resolving complex issues
- **Repository Integration**: Connects to your codebase via MCP servers
- **Stacktrace Analysis**: Automatically analyzes error patterns and suggests solutions
- **Knowledge Management**: Indexes documentation and past incidents for quick retrieval
- **Ticket Integration**: Works with Jira, Salesforce, and other ticketing systems

## Architecture

### Revised 24-Hour MVP Architecture for AI-Powered Oncall Support Assistant

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

## Getting Started

[Installation and setup instructions will be provided here]

## Documentation

See the `docs/` directory for detailed documentation.
