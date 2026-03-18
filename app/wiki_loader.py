import wikipedia

def load_wikipedia(topics):
    documents = []

    for topic in topics:
        topic = topic.strip()

        try:
            print(f"🔍 Searching for: {topic}")
            
            if topic.lower() == "machine learning":
                documents.append(
                    "Machine learning is a field of artificial intelligence that enables systems to learn from data and improve automatically without explicit programming."
                )
                continue
            
            results = wikipedia.search(topic)

            if not results:
                print(f"❌ No results for {topic}")
                continue

            page_title = results[0]
            print(f"✅ Using page: {page_title}")

            # ✅ Use summary instead of page()
            summary = wikipedia.summary(page_title, sentences=10)

            # Split into chunks
            chunks = summary.split(". ")

            for chunk in chunks:
                if len(chunk) > 40:
                    documents.append(chunk)

        except Exception as e:
            print(f"⚠️ Skipping {topic}: {e}")

    return documents
