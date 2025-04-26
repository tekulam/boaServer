"""
Tests for ticket parser.
"""

import pytest
from app.utils.ticket_parser import extract_key_entities, extract_stacktrace, parse_ticket


def test_extract_key_entities():
    """Test entity extraction from ticket text."""
    # Sample ticket
    ticket_text = """
    Service UserAuth is returning 500 errors in production environment.
    The error code is AUTH_FAILURE when accessing the /api/users/login endpoint.
    Check the file /src/auth/middleware.js for potential issues.
    """
    
    entities = extract_key_entities(ticket_text)
    
    assert "UserAuth" in entities["service_names"]
    assert "AUTH_FAILURE" in entities["error_codes"]
    assert "/src/auth/middleware.js" in entities["file_paths"]
    assert "/api/users/login" in entities["endpoints"]
    assert "production" in entities["environments"]


def test_extract_stacktrace():
    """Test stacktrace extraction from ticket text."""
    # Sample Java stacktrace
    java_stacktrace = """
    The application crashed with the following error:
    
    java.lang.NullPointerException: Cannot invoke "String.length()" because "input" is null
        at com.example.app.StringUtils.processInput(StringUtils.java:45)
        at com.example.app.ApiController.handleRequest(ApiController.java:23)
        at com.example.app.Main.main(Main.java:12)
    """
    
    result = extract_stacktrace(java_stacktrace)
    assert result is not None
    assert "java.lang.NullPointerException" in result
    
    # Sample with no stacktrace
    no_stacktrace = "This is a regular ticket with no error stacktrace."
    assert extract_stacktrace(no_stacktrace) is None


def test_parse_ticket():
    """Test complete ticket parsing."""
    ticket_id = "ISSUE-123"
    ticket_title = "UserAuth service returning 500 errors in production"
    ticket_description = """
    The UserAuth service is returning 500 errors in production environment.
    The error code is AUTH_FAILURE when accessing the /api/users/login endpoint.
    
    java.lang.NullPointerException: Cannot invoke "String.length()" because "input" is null
        at com.example.app.StringUtils.processInput(StringUtils.java:45)
        at com.example.app.ApiController.handleRequest(ApiController.java:23)
        at com.example.app.Main.main(Main.java:12)
    
    Please check the file /src/auth/middleware.js for potential issues.
    """
    
    parsed = parse_ticket(ticket_id, ticket_title, ticket_description)
    
    assert parsed["ticket_id"] == ticket_id
    assert parsed["title"] == ticket_title
    assert parsed["category"] == "error"
    assert parsed["has_stacktrace"] is True
    assert "UserAuth" in parsed["entities"]["service_names"]
    assert "java.lang.NullPointerException" in parsed["stacktrace"]
