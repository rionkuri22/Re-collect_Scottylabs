"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ChatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      {/* Brand — scotty-logo.png replaces the red square */}
      <div className="navbar-brand">
        <img src="/scotty-logo.png" alt="ScottyLabs" className="navbar-brand-icon-img" />
        <div className="navbar-brand-text">
          <span className="navbar-brand-title">Re:collect</span>
          <span className="navbar-brand-sub">TartanHacks 2027</span>
        </div>
      </div>

      {/* Nav links — immediately after brand, left-ish of center */}
      <div className="navbar-nav">
        <Link href="/" className={`navbar-nav-link ${pathname === "/" ? "active" : ""}`}>
          <ChatIcon />
          Chat
        </Link>
        <Link href="/search" className={`navbar-nav-link ${pathname === "/search" ? "active" : ""}`}>
          <SearchIcon />
          Search
        </Link>
      </div>

      {/* Right side: scotty logo image + divider + user avatar */}
      <div className="navbar-right">
        <img src="/user_icon.png" alt="User" className="navbar-user-avatar" />
      </div>
    </nav>
  );
}
