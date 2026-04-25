"use client";

import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-background">
      <div className="flex items-center gap-8">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight">Re:collect</span>
          <span className="text-[10px] font-bold text-scotty-red tracking-widest uppercase -mt-1">
            TartanHacks 2027
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">Chat</Link>
          <Link href="/search" className="text-sm font-medium hover:text-accent transition-colors">Search</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <img src="/scotty-logo.png" alt="Scotty Logo" className="h-8 w-auto" />
        <div className="h-8 w-[1px] bg-gray-800"></div>
        <img src="/user_icon.png" alt="User Icon" className="h-8 w-8 rounded-full border border-gray-700" />
      </div>
    </nav>
  );
}
