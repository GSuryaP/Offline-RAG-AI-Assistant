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
    const reason = parts[2] || "Evaluation pending";
    const accuracy = parts[3] || "N/A";
    const relevance = parts[4] || "N/A";
    const completeness = parts[5] || "N/A";

    const createMetric = (name, val) => {
        let num = parseInt(val);
        if (isNaN(num)) num = 0;
        const color = num >= 4 ? '#4caf50' : num >= 3 ? '#ff9800' : '#f44336';
        return `
        <div style="margin-bottom: 12px; font-family: 'Space Mono', monospace;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85em; margin-bottom: 5px; color: #b0bec5; text-transform: uppercase; letter-spacing: 0.5px;">
                <span>${name}</span>
                <span style="color: ${color}; font-weight: bold;">${val} / 5</span>
            </div>
            <div style="width: 100%; background: rgba(255,255,255,0.05); border-radius: 4px; height: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                <div style="width: ${(num / 5) * 100}%; background: ${color}; height: 100%; border-radius: 4px; transition: width 1s ease-out;"></div>
            </div>
        </div>
        `;
    };

    const accVal = parseInt(accuracy) || 0;
    const isVerified = accVal >= 4;
    const isOutOfContext = answer.toLowerCase().includes("information not found");

    let evalHeaderColor, evalHeaderIcon, evalHeaderTitle, evalSubtext1, evalSubtext2, borderColor, textColor;

    if (isOutOfContext) {
        evalHeaderColor = '#818cf8';
        evalHeaderIcon = 'ℹ️';
        evalHeaderTitle = 'INFORMATION NOT FOUND';
        evalSubtext1 = `<b>${evalHeaderIcon} OUT OF CONTEXT:</b> The AI correctly recognized the data is missing.`;
        evalSubtext2 = `<b>Evaluation:</b>`;
        borderColor = '#4f46e5';
        textColor = '#a5b4fc';
    } else if (isVerified) {
        evalHeaderColor = '#4ade80';
        evalHeaderIcon = '✅';
        evalHeaderTitle = 'ANSWER VERIFIED';
        evalSubtext1 = `<b>${evalHeaderIcon} ANSWER VERIFIED:</b> This answer is well-supported by the knowledge base.`;
        evalSubtext2 = `All key claims are grounded in the provided context:`;
        borderColor = '#059669';
        textColor = '#6ee7b7';
    } else {
        evalHeaderColor = '#fca5a5';
        evalHeaderIcon = '⚠️';
        evalHeaderTitle = 'HALLUCINATION DETECTED';
        evalSubtext1 = `<b>${evalHeaderIcon} POTENTIAL HALLUCINATION DETECTED:</b> Some parts of the answer lack support from the knowledge base.`;
        evalSubtext2 = `<b>Not found in knowledge base / Contradiction:</b>`;
        borderColor = '#b91c1c';
        textColor = '#fca5a5';
    }

    // BOT MESSAGE (LEFT)
    chat.innerHTML += `
        <div class="message bot">
            <div class="context">
                <b style="color: #bb86fc; font-size: 0.9em; letter-spacing: 1px;">📚 WIKIPEDIA CONTEXT</b>
                <div style="margin-top: 8px;">${context}</div>
            </div>
            <div class="answer" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                <b style="color: #03dac6; font-size: 0.9em; letter-spacing: 1px;">🤖 MODEL ANSWER</b>
                <div style="margin-top: 8px; color: #e0e0e0; font-size: 1.05em; line-height: 1.6;">${answer}</div>
            </div>
            <div class="evaluation" style="margin-top: 15px; padding: 15px; background: rgba(0,0,0,0.25); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="margin-bottom: 15px;">
                    <b style="color: #64ffda; font-size: 0.9em; letter-spacing: 1px; display: flex; align-items: center; gap: 6px;">
                        📊 PERFORMANCE METRICS
                    </b>
                    <div style="margin-top: 15px;">
                        ${createMetric("Accuracy (Context Match)", accuracy)}
                        ${createMetric("Relevance (To Query)", relevance)}
                        ${createMetric("Completeness", completeness)}
                    </div>
                </div>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <b style="color: ${evalHeaderColor}; font-size: 0.9em; letter-spacing: 1px; display: flex; align-items: center; gap: 6px;">
                        ${evalHeaderIcon} ${evalHeaderTitle}
                    </b>
                    <div style="margin-top: 10px; font-size: 0.9em; color: ${textColor}; line-height: 1.5;">
                        <p style="margin-bottom: 8px;">${evalSubtext1}</p>
                        <p style="margin-bottom: 8px;">${evalSubtext2}</p>
                        <div style="margin-left: 6px; padding-left: 12px; border-left: 3px solid ${borderColor}; opacity: 0.9;">
                            - ${reason}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // AUTO SCROLL
    chat.scrollTop = chat.scrollHeight;
}
