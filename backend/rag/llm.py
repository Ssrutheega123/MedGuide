from __future__ import annotations
import os
from dotenv import load_dotenv
from typing import Optional, Literal

load_dotenv()

Provider = Literal["groq", "openai", "auto"]

try:
    from groq import Groq
except ImportError:
    Groq = None

SYSTEM_BASE = "You are a careful medical assistant. Answer ONLY from the provided context. If unsure, say you do not know."


def _has_groq() -> bool:
    load_dotenv(override=True)
    return bool(os.getenv("GROQ_API_KEY")) and Groq is not None


def _get_active_model(override: Optional[str] = None) -> str:
    return override or os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")


def generate_answer(
    prompt: str,
    provider: str = "groq",
    model_override: Optional[str] = None,
    temperature: float = 0.2,
    max_tokens: int = 800,
) -> str:
    if not _has_groq():
        return "[No LLM configured. Set GROQ_API_KEY in .env]"

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    primary_model = _get_active_model(model_override)

    for model in [primary_model, "openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"]:
        try:
            completion = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": SYSTEM_BASE},
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
                max_completion_tokens=max_tokens,
                top_p=1,
                stream=False,
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            if "model_not_found" in str(e).lower() or "404" in str(e):
                continue
            return f"[Groq LLM error: {e}]"

    return "[Groq LLM error: Selected model not available on this API key]"


def summarize_history(
    text: str,
    provider: str = "groq",
    model_override: Optional[str] = None,
    max_tokens: int = 600,
) -> str:
    """
    Summarize older turns into a concise rolling summary included in prompts.
    """
    if not _has_groq():
        return ""

    sys = "You are a concise summarizer for a medical Q&A assistant. Produce a short, factual summary of the dialogue so far that preserves important clinical context and decisions. Avoid speculation."
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        model = model_override or os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": sys},
                {"role": "user", "content": text},
            ],
            temperature=0.1,
            max_completion_tokens=max_tokens,
            stream=False,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f"[Summary error (Groq): {e}]"