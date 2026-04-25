import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

import { ChatProvider } from "@/context/ChatContext";

export const metadata: Metadata = {
  title: "Re:collect | TartanHacks 2027",
  description: "Smart AI layer for community directories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChatProvider>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Navbar />
              <div className="flex-1 overflow-hidden">
                {children}
              </div>
            </main>
          </div>
        </ChatProvider>
      </body>
    </html>
  );
}
