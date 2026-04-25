"use client";

import React, { useState } from 'react';
import { Plus, MessageSquare, Pin, Trash2, Edit2, PinOff } from 'lucide-react';
import { useChat, Chat } from '@/context/ChatContext';

export default function Sidebar() {
  const { chats, pinned, addChat, setCurrentChatId, currentChatId } = useChat();

  return (
    <aside className="sidebar">
      <button 
        className="btn-primary mb-6 flex items-center justify-center gap-2" 
        onClick={() => setCurrentChatId(null)}
      >
        <Plus size={20} />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-8">
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
            Pinned Discoveries
          </h3>
          <div className="space-y-1">
            {pinned.length === 0 && (
              <p className="text-xs text-gray-600 px-2 italic">No pinned chats</p>
            )}
            {pinned.map(chat => (
              <ChatItem key={chat.id} chat={chat} isActive={currentChatId === chat.id} />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
            Recent Chats
          </h3>
          <div className="space-y-1">
            {chats.length === 0 && (
              <p className="text-xs text-gray-600 px-2 italic">No recent chats</p>
            )}
            {chats.map(chat => (
              <ChatItem key={chat.id} chat={chat} isActive={currentChatId === chat.id} />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2">
          <img src="/scotty-logo.png" alt="Scotty" className="w-8 h-8 rounded-full" />
          <span className="font-semibold text-sm">Re:collect</span>
        </div>
      </div>
    </aside>
  );
}

function ChatItem({ chat, isActive }: { chat: Chat, isActive: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const { pinChat, unpinChat, deleteChat, renameChat, setCurrentChatId } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  const handleRename = () => {
    renameChat(chat.id, title);
    setIsEditing(false);
  };

  return (
    <div 
      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
        isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800/50 text-gray-300'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isEditing && setCurrentChatId(chat.id)}
    >
      <div className="flex items-center gap-2 overflow-hidden flex-1">
        <MessageSquare size={16} className={`${isActive ? 'text-accent' : 'text-gray-500'} shrink-0`} />
        {isEditing ? (
          <input 
            autoFocus
            className="bg-transparent border-none outline-none text-sm w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          />
        ) : (
          <span className="text-sm truncate">{chat.title}</span>
        )}
      </div>
      
      {isHovered && !isEditing && (
        <div className="flex items-center gap-1 shrink-0">
          <button 
            className="p-1 hover:text-purple-400"
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          >
            <Edit2 size={14} />
          </button>
          <button 
            className="p-1 hover:text-purple-400"
            onClick={(e) => { e.stopPropagation(); chat.isPinned ? unpinChat(chat.id) : pinChat(chat.id); }}
          >
            {chat.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
          <button 
            className="p-1 hover:text-red-400"
            onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
