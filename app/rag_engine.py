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
        prompt = f"""Answer the question based ONLY on the provided context. If the answer cannot be found in the context, state "Information not found in context."

Context:
{context}

Question:
{query}

Answer:"""

        print("📌 Generating answer locally...")

        result = generator(prompt, max_length=300, do_sample=True, temperature=0.7)

        answer = result[0]['generated_text']

        print("📌 Programmatically evaluating reasoning & accuracy...")
        # Clean text for token matching
        import re
        ans_clean = re.sub(r'[^\w\s]', '', answer.lower())
        ctx_clean = re.sub(r'[^\w\s]', '', context.lower())
        
        ans_tokens = set(ans_clean.split())
        ctx_tokens = set(ctx_clean.split())
        
        overlap_ratio = len(ans_tokens.intersection(ctx_tokens)) / max(1, len(ans_tokens))
        is_substring = answer.lower() in context.lower()

        if "information not found" in answer.lower():
            reason = "The model accurately identified that the retrieved Wikipedia text does not contain the answer to this query."
            accuracy = "5"
            relevance = "0"
            completeness = "0"
        elif is_substring or overlap_ratio >= 0.5:
            reason = f"The model answer overlaps by {int(overlap_ratio*100)}% with the Wikipedia text, or entirely exists within the context. This verifies its validity."
            accuracy = "5" if is_substring else str(max(4, int(overlap_ratio * 5)))
            relevance = "5" if is_substring else str(max(4, int(overlap_ratio * 5)))
            completeness = "4" if is_substring else str(max(3, int(overlap_ratio * 5)))
        else:
            reason = f"Wait! The model answer only has a {int(overlap_ratio*100)}% word subset match with the Wikipedia context. It is heavily hallucinated."
            accuracy = str(min(2, int(overlap_ratio * 5)))
            relevance = "1"
            completeness = "1"

        return f"{context[:500]}|||{answer.strip()}|||{reason}|||{accuracy}|||{relevance}|||{completeness}"

    except Exception as e:
        print("❌ ERROR:", str(e))
        return f"❌ Internal Error: {str(e)}"
