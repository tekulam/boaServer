"""
Ticket parsing utilities for extracting information from issue tickets.
"""

import re
import logging
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)


def extract_key_entities(ticket_text: str) -> Dict[str, List[str]]:
    """
    Extract key entities from ticket text.
    
    Args:
        ticket_text: The ticket description or content
        
    Returns:
        Dictionary with extracted entities by category
    """
    # Initialize result
    entities = {
        "service_names": [],
        "error_codes": [],
        "file_paths": [],
        "endpoints": [],
        "environments": []
    }
    
    try:
        # Extract service names (simplified approach)
        service_pattern = r'(?i)(?:service|app|component|module)[\s:]+([a-zA-Z0-9_-]+)'
        service_matches = re.findall(service_pattern, ticket_text)
        entities["service_names"] = list(set(service_matches))
        
        # Extract error codes
        error_pattern = r'(?i)(?:error|exception|code)[\s:]+([A-Z0-9_]{3,})'
        error_matches = re.findall(error_pattern, ticket_text)
        entities["error_codes"] = list(set(error_matches))
        
        # Extract file paths
        file_pattern = r'(?:\/[\w\-\.]+)+\/?|(?:[\w-]+\.[\w-]+)'
        file_matches = re.findall(file_pattern, ticket_text)
        entities["file_paths"] = list(set(file_matches))
        
        # Extract API endpoints
        endpoint_pattern = r'(?i)(?:\/api\/[\w\/\-{}]+)|(?:endpoint[\s:]+([\/\w\-]+))'
        endpoint_matches = re.findall(endpoint_pattern, ticket_text)
        entities["endpoints"] = list(set([m for m in endpoint_matches if m]))
        
        # Extract environments
        env_pattern = r'(?i)(?:environment|env|in)[\s:]+([a-zA-Z0-9_-]+)'
        env_matches = re.findall(env_pattern, ticket_text)
        # Filter common environment names
        common_envs = ["prod", "production", "dev", "development", "staging", "test", "qa"]
        entities["environments"] = list(set([
            env for env in env_matches if env.lower() in common_envs
        ]))
        
        return entities
    
    except Exception as e:
        logger.error(f"Error extracting entities from ticket: {str(e)}")
        return entities


def extract_stacktrace(ticket_text: str) -> Optional[str]:
    """
    Extract stacktrace from ticket text.
    
    Args:
        ticket_text: The ticket description or content
        
    Returns:
        Extracted stacktrace or None if not found
    """
    try:
        # Common stacktrace patterns
        patterns = [
            # Pattern for Java/Scala style stacktraces
            r'(?:Exception|Error).*?\n(?:\s+at\s+[\w\.]+\([^)]+\)\n)+',
            # Pattern for Python tracebacks
            r'Traceback \(most recent call last\):\n(?:\s+File ".*", line \d+.*\n)+.*: .*',
            # Pattern for JavaScript/Node.js stacktraces
            r'(?:Error|Exception).*?\n(?:\s+at\s+[\w\.]+\s+\([^)]+\)\n)+'
        ]
        
        for pattern in patterns:
            matches = re.search(pattern, ticket_text, re.DOTALL)
            if matches:
                return matches.group(0)
        
        return None
    
    except Exception as e:
        logger.error(f"Error extracting stacktrace: {str(e)}")
        return None


def parse_ticket(
    ticket_id: str,
    ticket_title: str,
    ticket_description: str
) -> Dict[str, Any]:
    """
    Parse a ticket and extract useful information.
    
    Args:
        ticket_id: Ticket identifier
        ticket_title: Ticket title or summary
        ticket_description: Detailed ticket description
        
    Returns:
        Dictionary with parsed ticket information
    """
    try:
        # Combine title and description for entity extraction
        combined_text = f"{ticket_title}\n{ticket_description}"
        
        # Extract entities
        entities = extract_key_entities(combined_text)
        
        # Extract stacktrace
        stacktrace = extract_stacktrace(ticket_description)
        
        # Determine ticket category (simplified approach)
        category = "unknown"
        if "error" in ticket_title.lower() or "exception" in ticket_title.lower() or stacktrace:
            category = "error"
        elif "feature" in ticket_title.lower() or "enhancement" in ticket_title.lower():
            category = "feature"
        elif "bug" in ticket_title.lower():
            category = "bug"
        elif "performance" in ticket_title.lower() or "slow" in ticket_title.lower():
            category = "performance"
        
        # Build result
        return {
            "ticket_id": ticket_id,
            "title": ticket_title,
            "description": ticket_description,
            "category": category,
            "entities": entities,
            "stacktrace": stacktrace,
            "has_stacktrace": stacktrace is not None
        }
    
    except Exception as e:
        logger.error(f"Error parsing ticket: {str(e)}")
        return {
            "ticket_id": ticket_id,
            "title": ticket_title,
            "description": ticket_description,
            "error": str(e)
        }
