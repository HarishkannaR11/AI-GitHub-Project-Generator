'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, DOMAIN_OPTIONS, formatDate } from '@/lib/utils'
import type { GenerateResponse } from '@/types'
import {
    Bookmark, BookmarkCheck,
    Check,
    Copy,
    Download,
    Eye,
    Share2
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface ProjectOutputProps {
    result: GenerateResponse
}

const SECTION_ICONS: Record<string, string> = {
    '1. Project Title': '🚀',
    '2. Problem Statement': '🎯',
    '3. Project Description': '📋',
    '4. Key Features': '✨',
    '5. Tech Stack': '🛠️',
    '6. System Architecture': '🏗️',
    '7. Folder Structure': '📁',
    '8. Sample API Endpoints': '🔌',
    '9. Example UI Screens': '🖥️',
    '10. Possible Enhancements': '🚀',
    '11. Development Plan With Git Commits': '📝',
}

export function ProjectOutput({ result }: ProjectOutputProps) {
    const [copied, setCopied] = useState(false)
    const [saved, setSaved] = useState(false)

    const domainLabel = DOMAIN_OPTIONS.find((d) => d.value === result.domain)?.label ?? result.domain

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result.content)
        setCopied(true)
        toast.success('Copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
    }

    const downloadMarkdown = () => {
        const blob = new Blob([result.content], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${result.title.replace(/\s+/g, '-').toLowerCase()}.md`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Downloaded!')
    }

    const toggleSave = async () => {
        try {
            const res = await fetch(`/api/projects/${result.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isSaved: !saved }),
            })
            if (!res.ok) throw new Error()
            setSaved((s) => !s)
            toast.success(saved ? 'Removed from saved' : 'Saved to your collection!')
        } catch {
            toast.error('Failed to update. Try again.')
        }
    }

    return (
        <div className="space-y-6 animate-fade-up">
            {/* Header bar */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white leading-tight">{result.title}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="violet">{domainLabel}</Badge>
                        {result.skills.split(',').slice(0, 4).map((s) => (
                            <Badge key={s} variant="secondary" className="text-xs">{s.trim()}</Badge>
                        ))}
                        {result.skills.split(',').length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                                +{result.skills.split(',').length - 4} more
                            </Badge>
                        )}
                        <span className="text-xs text-slate-500 ml-1">
                            {formatDate(result.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy markdown">
                        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={downloadMarkdown} title="Download .md">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={saved ? 'gradient' : 'gradient-outline'}
                        size="sm"
                        onClick={toggleSave}
                        className="gap-1.5"
                    >
                        {saved
                            ? <><BookmarkCheck className="h-4 w-4" /> Saved</>
                            : <><Bookmark className="h-4 w-4" /> Save</>
                        }
                    </Button>
                </div>
            </div>

            {/* Markdown content */}
            <Card className="glow-violet">
                <CardContent className="p-6 md:p-8">
                    <div className="markdown-content">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Custom heading renderer to add section icons
                                h2({ children, ...props }) {
                                    const text = String(children)
                                    const key = Object.keys(SECTION_ICONS).find((k) => text.includes(k))
                                    const icon = key ? SECTION_ICONS[key] : '📌'
                                    return (
                                        <h2 {...props} className="mt-8 mb-3 flex items-center gap-2 text-lg font-bold text-violet-300 border-b border-white/10 pb-2">
                                            <span>{icon}</span>
                                            <span>{children}</span>
                                        </h2>
                                    )
                                },
                                // Syntax-highlighted code blocks
                                code({ className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className ?? '')
                                    const isBlock = match !== null
                                    return isBlock ? (
                                        <SyntaxHighlighter
                                            style={oneDark as Record<string, React.CSSProperties>}
                                            language={match[1]}
                                            PreTag="div"
                                            className="rounded-xl !bg-[#0d0d1a] border border-white/10 !text-xs my-4"
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={cn('bg-white/10 text-violet-300 rounded px-1.5 py-0.5 text-xs font-mono', className)} {...props}>
                                            {children}
                                        </code>
                                    )
                                },
                                // Style tables
                                table({ children }) {
                                    return (
                                        <div className="overflow-x-auto my-4 rounded-xl border border-white/10">
                                            <table className="w-full text-sm border-collapse">{children}</table>
                                        </div>
                                    )
                                },
                                th({ children }) {
                                    return <th className="bg-violet-500/20 text-violet-200 px-4 py-2.5 text-left font-semibold border-b border-white/10">{children}</th>
                                },
                                td({ children }) {
                                    return <td className="px-4 py-2 text-slate-300 border-b border-white/5">{children}</td>
                                },
                            }}
                        >
                            {result.content}
                        </ReactMarkdown>
                    </div>
                </CardContent>
            </Card>

            {/* Share footer */}
            <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    Generated with GPT-4o
                </div>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 hover:text-violet-400 transition-colors"
                >
                    <Share2 className="h-4 w-4" />
                    Share
                </button>
            </div>
        </div>
    )
}
