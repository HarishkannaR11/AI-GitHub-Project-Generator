'use client'

import { Github, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#080812]/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25 transition-all duration-200 group-hover:shadow-violet-500/40">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-white tracking-tight">
                            AI Project<span className="text-gradient"> Gen</span>
                        </span>
                    </Link>

                    {/* Nav links */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Generator
                        </Link>
                        <Link
                            href="/history"
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            History
                        </Link>
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white transition-all duration-200"
                        >
                            <Github className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">View on GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}
