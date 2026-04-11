# Recent Changes Tracking Document

## [2026-04-11] Enhancements to RAG Engine Evaluation

### Features Added
- **Performance Evaluation Module:** The system now automatically evaluates the generated model answer against the retrieved Wikipedia context. It uses 3 explicit metrics rated from 1 to 5 (Accuracy, Relevance, and Completeness) instead of a single metric.
- **Reasoning/Conflict Checking:** The system checks if the answer contradicts the context or has missing information. It outputs a reasoning snippet (e.g. why the information might be wrong or missing, or simply confirming that it's fully supported).

### File Modifications
- **`app/rag_engine.py`**: Added `eval_score_prompt` and `eval_reason_prompt` logic within `get_answer()` using the generic FLAN-T5 model. Responses are chained into the final returned string.
- **`frontend/script.js`**: Enhanced the string parsing logic on the UI side to extract the performance and reasoning metrics, mapping them to a visually clean "Evaluation" sector inside the bot response block.
