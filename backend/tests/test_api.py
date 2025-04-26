"""
Tests for API endpoints.
"""

import pytest
from fastapi.testclient import TestClient


def test_health_endpoint(client):
    """Test that health endpoint returns 200."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "version" in response.json()
