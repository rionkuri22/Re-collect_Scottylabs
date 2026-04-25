"use client";

import React, { useState, useRef, useEffect } from "react";
import ProfileCard from "@/components/ProfileCard";
import { useChat } from "@/context/ChatContext";

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <line x1="22" y1="2" x2="11" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

/** Minimal markdown → React renderer. Handles **bold**, *italic*, bullet lists. */
function MarkdownText({ text }: { text: string }) {
  // Split into lines and process
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  function flushList(key: string) {
    if (listItems.length > 0) {
      elements.push(<ul key={key} style={{ margin: "6px 0 6px 18px", listStyleType: "disc" }}>{listItems}</ul>);
      listItems = [];
    }
  }

  function renderInline(raw: string): React.ReactNode[] {
    // Convert **bold** and *italic*
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let last = 0, m;
    while ((m = regex.exec(raw)) !== null) {
      if (m.index > last) parts.push(raw.slice(last, m.index));
      if (m[2]) parts.push(<strong key={m.index}>{m[2]}</strong>);
      else if (m[3]) parts.push(<em key={m.index}>{m[3]}</em>);
      last = m.index + m[0].length;
    }
    if (last < raw.length) parts.push(raw.slice(last));
    return parts;
  }

  lines.forEach((line, i) => {
    const bullet = line.match(/^[*\-]\s+(.+)/);
    if (bullet) {
      listItems.push(<li key={i}>{renderInline(bullet[1])}</li>);
    } else {
      flushList(`list-${i}`);
      if (line.trim() === "") {
        elements.push(<br key={`br-${i}`} />);
      } else {
        elements.push(<p key={i} style={{ margin: "2px 0" }}>{renderInline(line)}</p>);
      }
    }
  });
  flushList("list-end");

  return <div className="chat-msg-text">{elements}</div>;
}

export default function ChatPage() {
  const { currentChatId, chats, pinned, addChat, updateChatMessages } = useChat();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentChat = [...chats, ...pinned].find(c => c.id === currentChatId);
  const messages: any[] = currentChat?.messages || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setLoading(true);

    let chatId = currentChatId;
    let msgs = [...messages, { role: "user", content: text }];
    if (!chatId) {
      chatId = addChat(text);
    } else {
      updateChatMessages(chatId, msgs);
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      msgs = [
        ...msgs,
        {
          role: "bot",
          content: data.error || data.answer || "I've analyzed the CMU community profiles. Here are the strongest matches.",
          recommendedPeople: data.recommendedPeople,
        },
      ];
    } catch {
      msgs = [...msgs, { role: "bot", content: "Sorry, an error occurred. Please try again." }];
    }

    updateChatMessages(chatId, msgs);
    setLoading(false);
  }

  return (
    <div className="chat-page">
      {/* Scroll area */}
      <div className="chat-scroll">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <h1>How can I help you today?</h1>
            <p>Search the TartanHacks registry using natural language.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="chat-msg-row fade-in">
              {msg.role === "user" ? (
                <img src="/user_icon.png" alt="You" className="chat-avatar" />
              ) : (
                <div className="chat-ai-icon"><StarIcon /></div>
              )}
              <div className="chat-msg-body">
                {msg.role === "user"
                  ? <p className="chat-msg-text">{msg.content}</p>
                  : <MarkdownText text={msg.content} />
                }
                {msg.recommendedPeople?.length > 0 && (
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                    {msg.recommendedPeople.map((p: any, j: number) => (
                      <ProfileCard key={j} person={p} variant="chat" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="chat-msg-row fade-in">
            <div className="chat-ai-icon"><StarIcon /></div>
            <div className="chat-msg-body">
              <p className="chat-msg-text" style={{ color: "#9ca3af" }}>Searching the CMU network…</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar — no plus icon */}
      <div className="chat-input-bar">
        <div className="chat-input-inner">
          <input
            className="chat-input-field"
            placeholder="Ask follow-up or explore new connections..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button className="chat-send-btn" onClick={handleSend} disabled={loading}>
            {loading ? <SpinnerIcon /> : <SendIcon />}
          </button>
        </div>
        <p className="chat-powered-by">Powered by Re:collect Intelligence • Carnegie Mellon University</p>
      </div>
    </div>
  );
}
