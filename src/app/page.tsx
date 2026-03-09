'use client'

import { GeneratorForm } from '@/components/GeneratorForm'
import { HistoryPanel } from '@/components/HistoryPanel'
import { Navbar } from '@/components/Navbar'
import { ProjectOutput } from '@/components/ProjectOutput'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GenerateResponse } from '@/types'
import { ArrowRight, Brain, Code2, GitBranch, Sparkles, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const STATS = [
    { icon: Brain, label: 'AI-Powered', value: 'GPT-4o' },
    { icon: Code2, label: 'Project Sections', value: '11' },
    { icon: GitBranch, label: 'Git Commits', value: '14+' },
    { icon: Zap, label: 'Generation Time', value: '~15s' },
]

const ROTATING_WORDS = ['Web App', 'AI Tool', 'API Service', 'Mobile App', 'DevOps Pipeline', 'SaaS Product']

export default function HomePage() {
    const [result, setResult] = useState<GenerateResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [wordIndex, setWordIndex] = useState(0)
    const [visible, setVisible] = useState(true)

    // Rotating word animation
    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false)
            setTimeout(() => {
                setWordIndex((i) => (i + 1) % ROTATING_WORDS.length)
                setVisible(true)
            }, 300)
        }, 2500)
        return () => clearInterval(interval)
    }, [])

    const handleResult = (res: GenerateResponse) => {
        setResult(res)
        setRefreshTrigger((n) => n + 1)
        // Scroll to result
        setTimeout(() => {
            document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
    }

    // Load a project from history
    const handleSelectFromHistory = async (id: string) => {
        try {
            const res = await fetch(`/api/projects/${id}`)
            const data = await res.json()
            setResult({
                id: data.id,
                content: data.content,
                title: data.title,
                skills: data.skills,
                domain: data.domain,
                createdAt: data.createdAt,
            })
            document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } catch {
            toast.error('Failed to load project')
        }
    }

    return (
        <div className="animated-bg min-h-screen">
            <div className="bg-grid absolute inset-0 pointer-events-none" />
            <Navbar />

            <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                {/* Hero Section */}
                <section className="text-center space-y-6 pt-8">
                    <Badge variant="violet" className="px-4 py-1.5 text-xs font-medium mx-auto">
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        Powered by GPT-4o
                    </Badge>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                        Generate your next{' '}
                        <span
                            className={`text-gradient transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {ROTATING_WORDS[wordIndex]}
                        </span>
                        <br />
                        idea in seconds
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Enter your skills and pick an interest area. Our AI generates a full, portfolio-worthy
                        GitHub project idea — complete with architecture, tech stack, API endpoints, folder
                        structure, and a detailed git commit plan.
                    </p>

                    {/* Stats row */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        {STATS.map(({ icon: Icon, label, value }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2"
                            >
                                <Icon className="h-4 w-4 text-violet-400" />
                                <span className="text-sm font-semibold text-white">{value}</span>
                                <span className="text-xs text-slate-500">{label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Main 2-col layout */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Form + History */}
                    <div className="space-y-6">
                        {/* Generator Card */}
                        <Card className="glow-violet-hover">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Sparkles className="h-4 w-4 text-violet-400" />
                                    Project Generator
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <GeneratorForm
                                    onResult={handleResult}
                                    onLoading={setIsLoading}
                                    isLoading={isLoading}
                                />
                            </CardContent>
                        </Card>

                        {/* History Card */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <GitBranch className="h-4 w-4 text-indigo-400" />
                                    Recent Projects
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <HistoryPanel
                                    refreshTrigger={refreshTrigger}
                                    onSelect={handleSelectFromHistory}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Output */}
                    <div className="lg:col-span-2" id="result-section">
                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : result ? (
                            <ProjectOutput result={result} />
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </section>

                {/* How it works */}
                <section className="space-y-8 pb-8">
                    <h2 className="text-2xl font-bold text-white text-center">How it works</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            {
                                step: '01',
                                icon: '🧠',
                                title: 'Enter Your Skills',
                                desc: 'Type in your technical skills — React, Python, Docker, anything.',
                            },
                            {
                                step: '02',
                                icon: '🎯',
                                title: 'Pick a Domain',
                                desc: 'Choose an interest area: Web, AI/ML, DevOps, Blockchain, and more.',
                            },
                            {
                                step: '03',
                                icon: '🚀',
                                title: 'Get Your Project Plan',
                                desc: 'AI generates a complete, portfolio-ready project idea with architecture, commits, and more.',
                            },
                        ].map((item) => (
                            <Card key={item.step} className="glass-hover text-center">
                                <CardContent className="pt-8 pb-6 space-y-3">
                                    <div className="text-4xl">{item.icon}</div>
                                    <div className="text-xs font-mono text-violet-400">{item.step}</div>
                                    <h3 className="font-semibold text-white">{item.title}</h3>
                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[480px] rounded-2xl border border-dashed border-white/10 bg-white/2 space-y-5">
            <div className="text-6xl animate-float">💡</div>
            <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-white">Your project idea will appear here</h3>
                <p className="text-sm text-slate-500 max-w-xs">
                    Add your skills, choose a domain, and hit{' '}
                    <span className="text-violet-400">Generate</span> to get started.
                </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <ArrowRight className="h-3.5 w-3.5" />
                Complete the form on the left
            </div>
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <Card className="animate-pulse-glow">
            <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                    <div className="h-7 w-2/3 rounded-lg bg-white/10" />
                    <div className="flex gap-2">
                        <div className="h-5 w-20 rounded-full bg-violet-500/20" />
                        <div className="h-5 w-16 rounded-full bg-white/10" />
                        <div className="h-5 w-24 rounded-full bg-white/10" />
                    </div>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-5 w-1/3 rounded bg-violet-500/20" />
                        <div className="space-y-1.5">
                            <div className="h-3.5 w-full rounded bg-white/5" />
                            <div className="h-3.5 w-5/6 rounded bg-white/5" />
                            <div className="h-3.5 w-4/6 rounded bg-white/5" />
                        </div>
                    </div>
                ))}
                <div className="text-center text-sm text-slate-500 flex items-center justify-center gap-2 pt-4">
                    <Sparkles className="h-4 w-4 text-violet-400 animate-spin" />
                    GPT-4o is thinking...
                </div>
            </CardContent>
        </Card>
    )
}
