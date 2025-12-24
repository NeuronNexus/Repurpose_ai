import json
import re

def safe_json_load(text: str) -> dict:
    """
    Extracts and parses the first valid JSON object from LLM output.
    Raises ValueError if impossible.
    """
    if not text or not text.strip():
        raise ValueError("Empty LLM response")

    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try to extract JSON block
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("No JSON object found in LLM response")

    try:
        return json.loads(match.group())
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid extracted JSON: {e}")
