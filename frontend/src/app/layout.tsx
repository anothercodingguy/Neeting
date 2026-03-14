import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neeting — AI Meeting Notes",
  description: "AI-powered meeting note generator, summarization, and RAG chat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
