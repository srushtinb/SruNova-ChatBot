import { useState, useRef, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { text: data.reply, isUser: false }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, something went wrong.", isUser: false },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Network error. Check backend.", isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A1A2F",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          height: "90vh",
          background: "linear-gradient(135deg, #0A1A2F 0%, #0F3460 100%)",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            background: "rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h1 style={{ margin: 0, color: "#00D4FF", fontSize: "24px" }}>
            SruNova
          </h1>
          <p style={{ margin: "5px 0 0", color: "#88C0FF", fontSize: "14px" }}>
            Your AI Companion
          </p>
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.isUser ? "flex-end" : "flex-start",
                maxWidth: "80%",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "18px",
                  background: msg.isUser ? "#00BFFF" : "#16213E",
                  color: msg.isUser ? "#000814" : "white",
                  fontSize: "15px",
                  lineHeight: "1.4",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ alignSelf: "flex-start" }}>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "18px",
                  background: "#16213E",
                  color: "white",
                  display: "flex",
                  gap: "6px",
                }}
              >
                <span style={{ animation: "dot 1.5s infinite" }}>•</span>
                <span style={{ animation: "dot 1.5s infinite 0.5s" }}>•</span>
                <span style={{ animation: "dot 1.5s infinite 1s" }}>•</span>
                <span style={{ marginLeft: "8px" }}>SruNova is thinking</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "16px",
            background: "rgba(255,255,255,0.03)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "14px 16px",
                borderRadius: "12px",
                border: "none",
                background: "#16213E",
                color: "white",
                fontSize: "15px",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "0 20px",
                background: "#00BFFF",
                color: "#000814",
                border: "none",
                borderRadius: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dot {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
