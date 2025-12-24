import requests
import json
import time

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "llama3.1:8b"


def call_ollama(system_prompt: str, user_prompt: str, temperature: float = 0.3) -> str:
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "options": {
            "temperature": temperature
        },
        "stream": False
    }

    print("\n[OLLAMA] Sending request...")
    print(f"[OLLAMA] Model: {MODEL}")
    print(f"[OLLAMA] System prompt length: {len(system_prompt)}")
    print(f"[OLLAMA] User prompt length: {len(user_prompt)}")

    start = time.time()

    try:
        res = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=600  # wait patiently (10 minutes)
        )
        res.raise_for_status()
    except Exception as e:
        print("[OLLAMA] Request failed")
        raise e

    elapsed = round(time.time() - start, 2)
    print(f"[OLLAMA] Response received in {elapsed}s")

    data = res.json()

    # Defensive logging
    if "message" not in data or "content" not in data["message"]:
        print("[OLLAMA] Unexpected response format:")
        print(json.dumps(data, indent=2))
        raise ValueError("Invalid Ollama response format")

    return data["message"]["content"]
