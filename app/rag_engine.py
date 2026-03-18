from app.embedder import model, create_index
from app.wiki_loader import load_wikipedia

from transformers import pipeline

# Load FLAN-T5 model
generator = pipeline("text2text-generation", model="google/flan-t5-base")

documents = []
index = None


def initialize(topics):
    global documents, index

    print("🚀 Initializing with topics:", topics)

    documents = load_wikipedia(topics)

    if not documents:
        print("❌ No documents loaded!")
        return

    index, _ = create_index(documents)

    print("✅ FAISS index created with", len(documents), "documents")


def get_answer(query):
    global index, documents

    print("\n🔥 Query received:", query)

    if index is None or len(documents) == 0:
        return "⚠️ Please initialize topics first."

    try:
        # Encode query
        query_embedding = model.encode([query])

        # Search FAISS
        D, I = index.search(query_embedding, k=5)

        valid_indices = [i for i in I[0] if i != -1]

        context = ". ".join(valid_indices and [documents[i] for i in valid_indices[:2]])  # limit size

        # Prompt for FLAN-T5
        prompt = f"""
        You are an expert AI assistant.

        Using ONLY the context below, give a clear, complete, and meaningful answer.

        - Explain properly (2–3 sentences)
        - Do not give short answers
        - Do not guess outside context

        Context:
        {context}

        Question:
        {query}

        Answer:
        """

        print("📌 Generating answer locally...")

        result = generator(prompt, max_length=300, do_sample=True, temperature=0.7)

        answer = result[0]['generated_text']

        return f"{context[:500]}|||{answer.strip()}"

    except Exception as e:
        print("❌ ERROR:", str(e))
        return f"❌ Internal Error: {str(e)}"
