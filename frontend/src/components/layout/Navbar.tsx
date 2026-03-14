"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <BrainCircuit className="h-7 w-7 text-zinc-300 group-hover:text-white transition-colors" />
          <span className="text-lg font-bold tracking-tight text-zinc-100">
            Neeting
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
