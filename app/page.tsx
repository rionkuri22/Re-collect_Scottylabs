"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import { useChat } from '@/context/ChatContext';

interface Message {
  role: 'user' | 'bot';
  content: string;
  recommendedPeople?: any[];
}

export default function ChatPage() {
  const { currentChatId, chats, pinned, addChat, updateChatMessages, setCurrentChatId } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = [...chats, ...pinned].find(c => c.id === currentChatId);
  const messages = currentChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    let chatId = currentChatId;
    let updatedMessages = [...messages, { role: 'user', content: userMessage }];

    if (!chatId) {
      chatId = addChat(userMessage);
    } else {
      updateChatMessages(chatId, updatedMessages);
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.error) {
        updatedMessages = [...updatedMessages, { role: 'bot', content: data.error }];
      } else {
        updatedMessages = [...updatedMessages, { 
            role: 'bot', 
            content: data.answer, 
            recommendedPeople: data.recommendedPeople 
        }];
      }
      updateChatMessages(chatId, updatedMessages);
    } catch (error) {
      updatedMessages = [...updatedMessages, { role: 'bot', content: "Sorry, I encountered an error." }];
      updateChatMessages(chatId, updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 fade-in">
            <h1 className="text-4xl font-bold text-gradient">How can I help you today?</h1>
            <p className="text-text-secondary max-w-md">
              Ask me about anyone in the CMU community. I can help you find collaborators, 
              researchers, or just tell you more about someone's background.
            </p>
          </div>
        )}

        {messages.map((msg: any, i: number) => (
          <div key={i} className={`flex gap-4 fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Bot size={18} className="text-accent" />
              </div>
            )}
            
            <div className={`flex flex-col gap-3 max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-accent text-background font-medium' 
                  : 'bg-card-bg border border-border'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.recommendedPeople && msg.recommendedPeople.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {msg.recommendedPeople.map((person: any, j: number) => (
                    <ProfileCard key={j} person={person} />
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                <User size={18} className="text-gray-400" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            className="input-bar pr-12"
            placeholder="Ask Re:collect..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-accent hover:text-accent-hover transition-colors"
            onClick={handleSend}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
