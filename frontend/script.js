const API = "http://127.0.0.1:8000";

async function init() {
    const topics = document
        .getElementById("topics")
        .value
        .split(",")
        .map(t => t.trim());

    await fetch(API + "/init", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ topics })
    });

    alert("✅ Knowledge Base Initialized!");
}

async function ask() {
    const questionInput = document.getElementById("question");
    const question = questionInput.value;
    const chat = document.getElementById("chat");

    // Hide empty state if visible
    const empty = document.querySelector('.chat-empty');
    if (empty) empty.style.display = 'none';

    // USER MESSAGE (RIGHT)
    chat.innerHTML += `
        <div class="message user">
            ${question}
        </div>
    `;

    // CLEAR INPUT
    questionInput.value = "";

    // FETCH RESPONSE
    const res = await fetch(API + "/ask", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ question })
    });

    const data = await res.json();

    // SPLIT CONTEXT & ANSWER
    const parts = data.answer.split("|||");

    const context = parts[0] || "No context found";
    const answer = parts[1] || "No answer generated";

    // BOT MESSAGE (LEFT)
    chat.innerHTML += `
        <div class="message bot">
            <div class="context">
                <b>📚 Wikipedia Context</b>
                ${context}
            </div>
            <div class="answer">
                <b>🤖 Answer</b>
                ${answer}
            </div>
        </div>
    `;

    // AUTO SCROLL
    chat.scrollTop = chat.scrollHeight;
}
