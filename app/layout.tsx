import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { ChatProvider } from "@/context/ChatContext";

export const metadata: Metadata = {
  title: "Re:collect | TartanHacks 2027",
  description: "Smart AI layer for community directories — Carnegie Mellon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChatProvider>
          {/* Navbar spans full width at the very top */}
          <Navbar />
          {/* Below navbar: sidebar + page content side by side */}
          <div className="below-nav">
            <Sidebar />
            <div className="page-content">
              {children}
            </div>
          </div>
        </ChatProvider>
      </body>
    </html>
  );
}
