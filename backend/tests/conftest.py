"""
Pytest fixtures for BoaServer tests.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.llm.gemini import GeminiClient


@pytest.fixture
def client():
    """Create a FastAPI test client."""
    return TestClient(app)


@pytest.fixture
def sample_ticket():
    """Sample ticket data for testing."""
    return {
        "id": "TICKET-123",
        "title": "Service returning 500 errors in production",
        "description": """
        The UserAuth service is returning 500 errors in production environment.
        The error code is AUTH_FAILURE when accessing the /api/users/login endpoint.
        
        java.lang.NullPointerException: Cannot invoke "String.length()" because "input" is null
            at com.example.app.StringUtils.processInput(StringUtils.java:45)
            at com.example.app.ApiController.handleRequest(ApiController.java:23)
            at com.example.app.Main.main(Main.java:12)
        
        Please check the file /src/auth/middleware.js for potential issues.
        """
    }


@pytest.fixture
def mock_mcp_client(monkeypatch):
    """Mock MCP client for testing."""
    class MockMCPClient:
        async def get_file(self, path, repo, ref="main"):
            return {
                "path": path,
                "content": "// Sample code content for testing\nfunction authenticate(user) {\n  return user.token != null;\n}",
                "size": 100,
                "last_modified": "2023-04-01T12:00:00Z"
            }
        
        async def search_code(self, query, repositories=None, limit=10):
            return [
                {
                    "file": "/src/auth/middleware.js",
                    "line": 45,
                    "snippet": "return user.token.validate();",
                    "repository": "user-service"
                }
            ]
    
    monkeypatch.setattr("app.mcp.client.get_mcp_client", lambda: MockMCPClient())
    return MockMCPClient()


@pytest.fixture
def mock_gemini_client(monkeypatch):
    """Mock Gemini client for testing."""
    class MockGeminiClient:
        async def generate_response(self, prompt, context=None):
            return "This is a mock response from Gemini for testing purposes."
        
        async def analyze_code(self, code, language, query=None):
            return {
                "analysis": "This code has a potential null pointer issue at line 45.",
                "language": language,
                "success": True
            }
    
    monkeypatch.setattr("app.llm.gemini.get_gemini_client", lambda: MockGeminiClient())
    return MockGeminiClient()
