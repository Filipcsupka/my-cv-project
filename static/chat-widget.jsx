/* global React */
/* AI Chat Widget — talks to the RAG API running on the home GPU node.
   Streaming via SSE (fetch + ReadableStream). Terminal aesthetic matches the site. */

const AI_CHAT_URL = "https://ai.filipcsupka.online";

const SUGGESTIONS = [
  "What is Filip's strongest skill?",
  "Tell me about the GPU setup powering this chat",
  "What does Filip do on weekends?",
  "Is Filip open to new roles?",
];

function ChatWidget() {
  const [open, setOpen]       = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput]     = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [apiOk, setApiOk]     = React.useState(null);
  const bottomRef = React.useRef(null);
  const inputRef  = React.useRef(null);

  React.useEffect(() => {
    fetch(`${AI_CHAT_URL}/health`)
      .then(r => setApiOk(r.ok))
      .catch(() => setApiOk(false));
  }, []);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);

    const userMsg      = { role: "user",      text: text.trim() };
    const assistantMsg = { role: "assistant", text: "", streaming: true };
    setMessages(prev => [...prev, userMsg, assistantMsg]);

    try {
      const res = await fetch(`${AI_CHAT_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true }).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const token = line.slice(6);
          if (token === "[DONE]" || token === "[ERROR]") break;
          accumulated += token.replace(/\\n/g, "\n");
        }
        setMessages(prev => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last.role === "assistant") next[next.length - 1] = { ...last, text: accumulated };
          return next;
        });
      }
    } catch {
      setMessages(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last.role === "assistant")
          next[next.length - 1] = { ...last, text: "Backend unreachable — GPU may be warming up. Try again in a moment." };
        return next;
      });
    } finally {
      setMessages(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last.role === "assistant" && last.streaming) next[next.length - 1] = { ...last, streaming: false };
        return next;
      });
      setLoading(false);
    }
  }

  const S = {
    btn: {
      position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999,
      width: 52, height: 52, borderRadius: "50%",
      border: "1px solid #42e0ff", background: "#071b31",
      color: "#42e0ff", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 22,
      boxShadow: open ? "0 0 0 2px #42e0ff" : "0 0 18px 3px rgba(66,224,255,0.3)",
      transition: "box-shadow 0.2s, transform 0.15s",
      transform: open ? "rotate(45deg)" : "none",
    },
    panel: {
      position: "fixed", bottom: "5.25rem", right: "1.5rem", zIndex: 9998,
      width: "min(420px, calc(100vw - 2rem))",
      height: "min(540px, calc(100vh - 8rem))",
      background: "#03101f", border: "1px solid #3480b6", borderRadius: 6,
      display: "flex", flexDirection: "column",
      fontFamily: "'JetBrains Mono', monospace",
      boxShadow: "0 0 32px rgba(66,224,255,0.12)",
      overflow: "hidden",
    },
    header: {
      padding: "8px 14px", borderBottom: "1px solid #24577e",
      display: "flex", alignItems: "center", gap: 8,
      background: "#071b31",
    },
    messages: {
      flex: 1, overflowY: "auto", padding: 10,
      display: "flex", flexDirection: "column", gap: 8,
    },
    inputRow: {
      padding: 8, borderTop: "1px solid #24577e",
      display: "flex", gap: 6, background: "#071b31",
    },
  };

  return React.createElement(React.Fragment, null,
    /* trigger button */
    React.createElement("button", {
      onClick: () => setOpen(o => !o),
      "aria-label": "Open AI chat",
      style: S.btn,
    }, open ? "✕" : "⚡"),

    /* panel */
    open && React.createElement("div", { style: S.panel },
      /* header */
      React.createElement("div", { style: S.header },
        React.createElement("span", { style: { color: "#5cffb1", fontSize: 11 } }, "●"),
        React.createElement("span", { style: { color: "#edf7ff", fontSize: 13, fontWeight: 700 } }, "filip-ai"),
        React.createElement("span", {
          style: { color: "#5f7f9e", fontSize: 11, marginLeft: "auto" }
        }, apiOk === null ? "connecting..." : apiOk ? "RTX 2070 · qwen3:8b" : "⚠ offline"),
      ),

      /* messages area */
      React.createElement("div", { style: S.messages },
        messages.length === 0 && React.createElement("div", null,
          React.createElement("p", {
            style: { color: "#a8bfd6", fontSize: 12, margin: "0 0 10px" }
          }, "Ask me anything about Filip — skills, projects, experience, or how this GPU-powered chatbot works."),
          SUGGESTIONS.map(s =>
            React.createElement("button", {
              key: s,
              onClick: () => sendMessage(s),
              style: {
                display: "block", width: "100%", marginBottom: 5,
                background: "#0c2743", border: "1px solid #24577e", borderRadius: 4,
                color: "#42e0ff", fontSize: 12, padding: "5px 8px",
                cursor: "pointer", textAlign: "left",
                fontFamily: "'JetBrains Mono', monospace",
              }
            }, `› ${s}`)
          ),
        ),

        messages.map((msg, i) =>
          React.createElement("div", {
            key: i,
            style: {
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "88%",
              background: msg.role === "user" ? "#0c2743" : "#071b31",
              border: `1px solid ${msg.role === "user" ? "#3480b6" : "#24577e"}`,
              borderRadius: 4, padding: "6px 10px",
            }
          },
            React.createElement("span", {
              style: {
                fontSize: 10, display: "block", marginBottom: 3,
                color: msg.role === "user" ? "#42e0ff" : "#5cffb1",
              }
            }, msg.role === "user" ? "> you" : "$ filip-ai"),
            React.createElement("span", {
              style: { fontSize: 13, color: "#edf7ff", whiteSpace: "pre-wrap", wordBreak: "break-word" }
            },
              msg.text,
              msg.streaming && React.createElement("span", {
                style: {
                  display: "inline-block", width: "0.5em", height: "1em",
                  background: "#42e0ff", marginLeft: 2,
                  animation: "chat-blink 1s steps(1) infinite",
                  verticalAlign: "text-bottom",
                }
              }),
            ),
          )
        ),
        React.createElement("div", { ref: bottomRef }),
      ),

      /* input */
      React.createElement("div", { style: S.inputRow },
        React.createElement("input", {
          ref: inputRef,
          value: input,
          onChange: e => setInput(e.target.value),
          onKeyDown: e => e.key === "Enter" && !e.shiftKey && sendMessage(input),
          placeholder: "ask about Filip...",
          disabled: loading,
          style: {
            flex: 1, background: "#03101f", border: "1px solid #24577e",
            borderRadius: 3, color: "#edf7ff", fontSize: 13,
            padding: "6px 10px", fontFamily: "'JetBrains Mono', monospace", outline: "none",
          },
        }),
        React.createElement("button", {
          onClick: () => sendMessage(input),
          disabled: loading || !input.trim(),
          style: {
            background: loading ? "#0c2743" : "#42e0ff",
            border: "none", borderRadius: 3,
            color: "#03101f", fontSize: 12, padding: "6px 10px",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
          }
        }, loading ? "..." : "send"),
      ),
    ),

    /* blink keyframe injected once */
    React.createElement("style", null, `
      @keyframes chat-blink { 0%,100%{opacity:1} 50%{opacity:0} }
    `),
  );
}
