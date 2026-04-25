"use client";

import React, { useState } from "react";
import { useChat, Chat } from "@/context/ChatContext";

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function MsgIcon({ active }: { active?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? "#c41230" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function PinIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>;
}
function PinOffIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><line x1="12" y1="17" x2="12" y2="22"/><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h12"/><path d="M15 9.34V6h1a2 2 0 0 0 0-4H7.89"/></svg>;
}
function EditIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
function TrashIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
}

export default function Sidebar() {
  const { chats, pinned, setCurrentChatId, currentChatId } = useChat();

  return (
    <aside className="sidebar">
      <button className="sidebar-new-chat-btn" onClick={() => setCurrentChatId(null)}>
        <PlusIcon />
        New Chat
      </button>

      <div className="sidebar-section">
        <p className="sidebar-section-label">Pinned Discovery</p>
        {pinned.length === 0
          ? <span className="sidebar-empty-label">No pinned items</span>
          : pinned.map(c => <ChatItem key={c.id} chat={c} active={c.id === currentChatId} />)
        }
      </div>

      <div className="sidebar-section">
        <p className="sidebar-section-label">Recent Chats</p>
        {chats.length === 0
          ? <span className="sidebar-empty-label">No recent chats</span>
          : chats.map(c => <ChatItem key={c.id} chat={c} active={c.id === currentChatId} />)
        }
      </div>

      <div className="sidebar-footer">
        <img src="/user_icon.png" alt="User" className="sidebar-footer-avatar" />
        <span className="sidebar-footer-name">Rion Kurihara</span>
      </div>
    </aside>
  );
}

function ChatItem({ chat, active }: { chat: Chat; active: boolean }) {
  const { pinChat, unpinChat, deleteChat, renameChat, setCurrentChatId } = useChat();
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  const commit = () => { renameChat(chat.id, title); setEditing(false); };

  return (
    <div
      className={`sidebar-item ${active ? "active" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !editing && setCurrentChatId(chat.id)}
    >
      <MsgIcon active={active} />

      {editing ? (
        <input
          autoFocus
          style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:14, color:"white", fontFamily:"inherit" }}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={commit}
          onKeyDown={e => e.key === "Enter" && commit()}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span className="sidebar-item-text">{chat.title}</span>
      )}

      {hovered && !editing && (
        <div className="sidebar-item-actions" onClick={e => e.stopPropagation()}>
          <button onClick={() => setEditing(true)} title="Rename"><EditIcon /></button>
          <button onClick={() => chat.isPinned ? unpinChat(chat.id) : pinChat(chat.id)} title={chat.isPinned ? "Unpin" : "Pin"}>
            {chat.isPinned ? <PinOffIcon /> : <PinIcon />}
          </button>
          <button onClick={() => deleteChat(chat.id)} title="Delete"><TrashIcon /></button>
        </div>
      )}
    </div>
  );
}
