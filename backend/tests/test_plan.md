# BoaServer Test Plan

This document outlines a simple, focused testing approach for the BoaServer MVP using pytest.

## Testing Goals

1. Verify core functionality works as expected
2. Ensure integrations with external systems function properly
3. Validate that the API endpoints return correct responses

## Test Structure

We'll organize tests into three categories:

1. **Unit Tests**: Testing individual components in isolation
2. **Integration Tests**: Testing interactions between components
3. **API Tests**: Testing API endpoints

## Unit Tests

Focus on testing each module independently, with mocked dependencies.

| Component | Test File | Test Cases |
|-----------|-----------|------------|
| Ticket Parser | `test_ticket_parser.py` | Extract entities, stacktraces, categorization |
| Gemini Client | `test_gemini_client.py` | Response generation, error handling |
| MCP Client | `test_mcp_client.py` | Repository access, file retrieval |
| Prompt Templates | `test_prompts.py` | Template formatting with various inputs |

## Integration Tests

Test interactions between components with minimal mocking.

| Integration | Test File | Test Cases |
|-------------|-----------|------------|
| MCP + LLM | `test_repo_analysis.py` | Code fetching and analysis workflow |
| Ticket + LLM | `test_ticket_analysis.py` | Ticket parsing and response generation |

## API Tests

Test API endpoints with FastAPI test client.

| Endpoint | Test File | Test Cases |
|----------|-----------|------------|
| Health Check | `test_api.py` | Verify health endpoint returns 200 |
| Chat | `test_chat_api.py` | Message processing, response generation |

## Test Implementation Approach

### 1. Create Fixtures

```python
# In conftest.py
import pytest
from fastapi.testclient import TestClient

from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def sample_ticket():
    return {
        "id": "TICKET-123",
        "title": "Service returning 500 errors in production",
        "description": "The service is failing with NullPointerException..."
    }

@pytest.fixture
def mock_mcp_client(monkeypatch):
    # Mock implementation of MCP client for testing
    pass
    
@pytest.fixture
def mock_gemini_client(monkeypatch):
    # Mock implementation of Gemini client for testing
    pass
```

### 2. Implement Tests

Example of a unit test:

```python
def test_ticket_parsing(sample_ticket):
    """Test that ticket parsing extracts correct entities."""
    parsed = parse_ticket(
        sample_ticket["id"], 
        sample_ticket["title"], 
        sample_ticket["description"]
    )
    
    assert parsed["ticket_id"] == sample_ticket["id"]
    assert "service_names" in parsed["entities"]
    assert parsed["category"] == "error"
```

Example of an API test:

```python
def test_health_endpoint(client):
    """Test that health endpoint returns 200."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
```

## Mocking Strategy

- Use `pytest-mock` for simple function mocks
- Use fixture-based mocks for complex components
- Create simple mock implementations rather than complex mock behaviors

## Running Tests

Basic test execution:

```bash
# Run all tests
poetry run pytest

# Run specific test file
poetry run pytest tests/test_ticket_parser.py

# Run with coverage
poetry run pytest --cov=app tests/
```

## Continuous Integration

For the 24-hour MVP, we'll focus on local testing. If time permits, a simple GitHub Actions workflow can be added:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install Poetry
        run: pip install poetry
      - name: Install dependencies
        run: poetry install
      - name: Run tests
        run: poetry run pytest
```

## Test Data

Keep test data simple and inline when possible. For complex test cases, create small JSON files in a `tests/data` directory.
