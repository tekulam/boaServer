"""
Google Gemini Pro API integration.
"""

import logging
import google.generativeai as genai
from typing import Dict, List, Optional, Any

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)


class GeminiClient:
    """Client for interacting with Google Gemini Pro API."""
    
    def __init__(self) -> None:
        """Initialize Gemini client with configuration."""
        self.model_name = settings.LLM_MODEL
        self.temperature = settings.LLM_TEMPERATURE
        self.max_tokens = settings.LLM_MAX_TOKENS
        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config={
                "temperature": self.temperature,
                "max_output_tokens": self.max_tokens,
                "top_p": 1.0,
                "top_k": 32,
            }
        )
    
    async def generate_response(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Generate a response from Gemini Pro.
        
        Args:
            prompt: The prompt to send to the model
            context: Optional additional context
            
        Returns:
            The generated text response
        """
        try:
            # Combine prompt with context if provided
            full_prompt = prompt
            if context:
                context_str = "\n\nAdditional Context:\n"
                for key, value in context.items():
                    context_str += f"{key}: {value}\n"
                full_prompt = f"{full_prompt}\n\n{context_str}"
            
            # Generate response
            response = self.model.generate_content(full_prompt)
            
            # Extract and return the text
            return response.text
        
        except Exception as e:
            logger.error(f"Error generating Gemini response: {str(e)}")
            return f"Error generating response: {str(e)}"
    
    async def analyze_code(self, code: str, language: str, query: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze code with Gemini Pro.
        
        Args:
            code: The code to analyze
            language: The programming language
            query: Optional specific query about the code
            
        Returns:
            Dictionary with analysis results
        """
        try:
            # Construct prompt for code analysis
            prompt = f"Analyze this {language} code:\n\n```{language}\n{code}\n```\n\n"
            if query:
                prompt += f"Specifically address this question: {query}"
            else:
                prompt += "Provide a clear explanation of what this code does, any potential issues, and suggestions for improvement."
            
            # Generate response
            response = await self.generate_response(prompt)
            
            # Return structured response
            return {
                "analysis": response,
                "language": language,
                "success": True
            }
        
        except Exception as e:
            logger.error(f"Error analyzing code: {str(e)}")
            return {
                "analysis": f"Error analyzing code: {str(e)}",
                "language": language,
                "success": False
            }


# Singleton instance
_gemini_client = None


def get_gemini_client() -> GeminiClient:
    """Get or create the Gemini client singleton."""
    global _gemini_client
    if _gemini_client is None:
        _gemini_client = GeminiClient()
    return _gemini_client
