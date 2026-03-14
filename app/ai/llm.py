from typing import List
from groq import Groq
import json
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL_NAME = "llama3-70b-8192" 

def generate_ai_response(prompt: str, transcript: str) -> str:
    """Helper method to construct standard prompts and call OpenAI."""
    full_prompt = f"{prompt}\n\nTranscript:\n{transcript}"
    
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "You are a highly capable AI assistant that analyzes meeting transcripts."},
            {"role": "user", "content": full_prompt}
        ],
        temperature=0.3
    )
    return response.choices[0].message.content

def get_meeting_summary(transcript: str) -> str:
    prompt = "Provide a concise summary of the following meeting transcript in 2-3 paragraphs. Focus on the main topics discussed."
    return generate_ai_response(prompt, transcript)

def get_key_points(transcript: str) -> List[str]:
    prompt = "Extract the top 3 to 5 key points from this meeting transcript. Output them as a JSON array of strings, e.g., [\"Point 1\", \"Point 2\"]. Only return valid JSON."
    try:
        response = generate_ai_response(prompt, transcript)
        # Attempt to parse json from response
        # In a real app we might use openai function calling, but this is simple enough
        cleaned = response.replace("```json", "").replace("```", "").strip()
        points = json.loads(cleaned)
        if isinstance(points, list):
             return points
        return [str(points)]
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return ["Could not extract key points cleanly. Please try again."]

def get_action_items(transcript: str) -> List[str]:
    prompt = "Extract all action items from this meeting. For each item, capture who is doing what. Output as a JSON array of strings. Only return valid JSON."
    try:
        response = generate_ai_response(prompt, transcript)
        cleaned = response.replace("```json", "").replace("```", "").strip()
        items = json.loads(cleaned)
        if isinstance(items, list):
             return items
        return [str(items)]
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return []

def get_decisions(transcript: str) -> List[str]:
    prompt = "Extract all major decisions made during this meeting. Output as a JSON array of strings. Only return valid JSON."
    try:
        response = generate_ai_response(prompt, transcript)
        cleaned = response.replace("```json", "").replace("```", "").strip()
        decisions = json.loads(cleaned)
        if isinstance(decisions, list):
             return decisions
        return [str(decisions)]
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return []

def answer_chat_query(query: str, retrieved_context: str) -> str:
    """Answers a question based on retrieved context from ChromaDB."""
    full_prompt = f"""Answer the following question based ONLY on the provided meeting context. 
If you don't know the answer based on the context, say "I cannot find the answer in the meeting records."

Context:
{retrieved_context}

Question: {query}
"""
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "You are a helpful meeting assistant. Answer accurately based on the context."},
            {"role": "user", "content": full_prompt}
        ],
        temperature=0.1
    )
    return response.choices[0].message.content
