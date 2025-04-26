"""
Prompt templates for LLM interactions.
"""

from typing import Dict, Any, Optional

# System prompt for engineering assistance
SYSTEM_PROMPT = """
You are BoaServer, an AI-powered oncall support assistant for engineering teams.
Your goal is to help engineers troubleshoot issues, analyze tickets, and find solutions.

Key capabilities:
1. Analyze error messages and code to identify root causes
2. Provide recommendations based on best practices and previous incidents
3. Help engineers understand complex systems and code
4. Suggest code improvements and refactoring opportunities

Always be clear, concise, and precise in your responses.
If you're unsure about something, acknowledge it rather than making up information.
When providing code solutions, ensure they follow best practices and are well-documented.
"""

# Ticket analysis prompt
TICKET_ANALYSIS_PROMPT = """
{system_prompt}

I'm looking at the following operational ticket:

Ticket ID: {ticket_id}
Title: {ticket_title}
Description: {ticket_description}

Please analyze this ticket and help me understand:
1. What is likely causing this issue?
2. Which parts of our codebase should I investigate?
3. What steps should I take to troubleshoot and resolve this?

{context}
"""

# Code analysis prompt
CODE_ANALYSIS_PROMPT = """
{system_prompt}

Please analyze this {language} code:

```{language}
{code}
```

Based on the ticket:
Ticket ID: {ticket_id}
Title: {ticket_title}
Description: {ticket_description}

Please provide:
1. An explanation of what this code does
2. How it relates to the reported issue
3. Potential problems or bugs that might be causing the issue
4. Suggested fixes or improvements

{context}
"""


def get_ticket_analysis_prompt(
    ticket_id: str,
    ticket_title: str,
    ticket_description: str,
    context: Optional[str] = None
) -> str:
    """
    Get the ticket analysis prompt.
    
    Args:
        ticket_id: Ticket identifier
        ticket_title: Ticket title or summary
        ticket_description: Detailed ticket description
        context: Additional context (optional)
        
    Returns:
        Formatted prompt for ticket analysis
    """
    return TICKET_ANALYSIS_PROMPT.format(
        system_prompt=SYSTEM_PROMPT,
        ticket_id=ticket_id,
        ticket_title=ticket_title,
        ticket_description=ticket_description,
        context=context or ""
    )


def get_code_analysis_prompt(
    code: str,
    language: str,
    ticket_id: str,
    ticket_title: str,
    ticket_description: str,
    context: Optional[str] = None
) -> str:
    """
    Get the code analysis prompt.
    
    Args:
        code: Source code to analyze
        language: Programming language
        ticket_id: Ticket identifier
        ticket_title: Ticket title or summary
        ticket_description: Detailed ticket description
        context: Additional context (optional)
        
    Returns:
        Formatted prompt for code analysis
    """
    return CODE_ANALYSIS_PROMPT.format(
        system_prompt=SYSTEM_PROMPT,
        language=language,
        code=code,
        ticket_id=ticket_id,
        ticket_title=ticket_title,
        ticket_description=ticket_description,
        context=context or ""
    )
