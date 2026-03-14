import chromadb
from chromadb.utils import embedding_functions
from app.config import settings

# Initialize ChromaDB client persistently
chroma_client = chromadb.PersistentClient(path=settings.CHROMADB_DIR)

# Use ChromaDB default local embedding function (all-MiniLM-L6-v2)
default_ef = embedding_functions.DefaultEmbeddingFunction()

# Get or create a collection for meeting chunks
collection = chroma_client.get_or_create_collection(
    name="meetings_collection",
    embedding_function=default_ef
)

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """Simple text chunker based on character count."""
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        if i + chunk_size >= len(words):
            break
    return chunks

def index_meeting_transcript(meeting_id: int, user_id: int, transcript: str):
    """Chunks a transcript and adds it to the vector database."""
    chunks = chunk_text(transcript)
    ids = [f"meeting_{meeting_id}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"meeting_id": meeting_id, "user_id": user_id} for _ in range(len(chunks))]
    
    # Upsert handles inserting or updating
    collection.upsert(
        documents=chunks,
        metadatas=metadatas,
        ids=ids
    )

def search_meeting_context(query: str, user_id: int, top_k: int = 3) -> str:
    """Searches for relevant chunks across the user's meetings."""
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        where={"user_id": user_id} # Filter by user
    )
    
    if not results["documents"] or len(results["documents"]) == 0:
        return ""
    
    # Flatten the results and join them into a single context string
    documents = results["documents"][0]
    return "\n...\n".join(documents)
