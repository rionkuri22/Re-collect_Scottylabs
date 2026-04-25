"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Chat {
  id: string;
  title: string;
  isPinned: boolean;
  messages: any[];
}

interface ChatContextType {
  chats: Chat[];
  pinned: Chat[];
  currentChatId: string | null;
  addChat: (firstMessage: string) => string;
  updateChatMessages: (chatId: string, messages: any[]) => void;
  pinChat: (chatId: string) => void;
  unpinChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
  setCurrentChatId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [pinned, setPinned] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Persistence (optional for MVP but good for state)
  useEffect(() => {
    const savedChats = localStorage.getItem('recollect_chats');
    const savedPinned = localStorage.getItem('recollect_pinned');
    if (savedChats) setChats(JSON.parse(savedChats));
    if (savedPinned) setPinned(JSON.parse(savedPinned));
  }, []);

  useEffect(() => {
    localStorage.setItem('recollect_chats', JSON.stringify(chats));
    localStorage.setItem('recollect_pinned', JSON.stringify(pinned));
  }, [chats, pinned]);

  const addChat = (firstMessage: string) => {
    const id = Date.now().toString();
    const title = firstMessage.split(' ').slice(0, 4).join(' ') + (firstMessage.split(' ').length > 4 ? '...' : '');
    const newChat: Chat = { id, title, isPinned: false, messages: [] };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(id);
    return id;
  };

  const updateChatMessages = (chatId: string, messages: any[]) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages } : c));
    setPinned(prev => prev.map(c => c.id === chatId ? { ...c, messages } : c));
  };

  const pinChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setChats(prev => prev.filter(c => c.id !== chatId));
      setPinned(prev => [{ ...chat, isPinned: true }, ...prev]);
    }
  };

  const unpinChat = (chatId: string) => {
    const chat = pinned.find(c => c.id === chatId);
    if (chat) {
      setPinned(prev => prev.filter(c => c.id !== chatId));
      setChats(prev => [{ ...chat, isPinned: false }, ...prev]);
    }
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    setPinned(prev => prev.filter(c => c.id !== chatId));
    if (currentChatId === chatId) setCurrentChatId(null);
  };

  const renameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
    setPinned(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
  };

  return (
    <ChatContext.Provider value={{ 
      chats, pinned, currentChatId, addChat, updateChatMessages, 
      pinChat, unpinChat, deleteChat, renameChat, setCurrentChatId 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
