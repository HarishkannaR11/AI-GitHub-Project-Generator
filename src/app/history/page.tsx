'use client'

import { Navbar } from '@/components/Navbar'
import { ProjectOutput } from '@/components/ProjectOutput'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, DOMAIN_OPTIONS, formatDate } from '@/lib/utils'
import type { GenerateResponse } from '@/types'
import { Bookmark, Clock, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface ProjectRecord {
    id: string
    title: string
    skills: string
    domain: string
    isSaved: boolean
    views: number
    createdAt: string
}

const DOMAIN_FILTER_OPTIONS = [{ value: '', label: 'All Domains' }, ...DOMAIN_OPTIONS.map(d => ({ value: d.value, label: d.label }))]

export default function HistoryPage() {
    const [projects, setProjects] = useState<ProjectRecord[]>([])
    const [selected, setSelected] = useState<GenerateResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'saved'>('all')
    const [domainFilter, setDomainFilter] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filter === 'saved') params.set('saved', 'true')
            if (domainFilter) params.set('domain', domainFilter)
            params.set('page', String(page))
            const res = await fetch(`/api/projects?${params}`)
            const data = await res.json()
            setProjects(data.projects ?? [])
            setTotal(data.total ?? 0)
        } catch {
            toast.error('Failed to load projects')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProjects() }, [filter, domainFilter, page])

    const openProject = async (id: string) => {
        try {
            const res = await fetch(`/api/projects/${id}`)
            const data = await res.json()
            setSelected({ id: data.id, content: data.content, title: data.title, skills: data.skills, domain: data.domain, createdAt: data.createdAt })
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch {
            toast.error('Failed to load project')
        }
    }

    const deleteProject = async (id: string) => {
        if (!confirm('Delete this project?')) return
        try {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' })
            setProjects((prev) => prev.filter((p) => p.id !== id))
            if (selected?.id === id) setSelected(null)
            toast.success('Deleted')
        } catch {
            toast.error('Failed to delete')
        }
    }

    return (
        <div className="animated-bg min-h-screen">
            <div className="bg-grid absolute inset-0 pointer-events-none" />
            <Navbar />

            <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Project History</h1>
                    <p className="text-slate-400">{total} project idea{total !== 1 ? 's' : ''} generated</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex gap-2">
                        {(['all', 'saved'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => { setFilter(f); setPage(1) }}
                                className={cn(
                                    'px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                                    filter === f
                                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                        : 'text-slate-500 hover:text-slate-300 border border-white/10'
                                )}
                            >
                                {f === 'saved' ? '🔖 Saved' : '🕒 All'}
                            </button>
                        ))}
                    </div>
                    <select
                        value={domainFilter}
                        onChange={(e) => { setDomainFilter(e.target.value); setPage(1) }}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-violet-500"
                    >
                        {DOMAIN_FILTER_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value} className="bg-[#13132a]">{o.label}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Project list */}
                    <div className="space-y-3">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-28 animate-pulse rounded-xl bg-white/5" />
                            ))
                        ) : projects.length === 0 ? (
                            <div className="py-16 text-center">
                                <p className="text-4xl mb-3">📭</p>
                                <p className="text-slate-500 text-sm">No projects found.</p>
                            </div>
                        ) : (
                            projects.map((p) => {
                                const domainLabel = DOMAIN_OPTIONS.find((d) => d.value === p.domain)?.label
                                return (
                                    <Card
                                        key={p.id}
                                        className={cn(
                                            'cursor-pointer glass-hover group transition-all duration-200',
                                            selected?.id === p.id && 'border-violet-500/50 bg-violet-500/5'
                                        )}
                                        onClick={() => openProject(p.id)}
                                    >
                                        <CardContent className="p-4 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-medium text-white group-hover:text-violet-200 transition-colors line-clamp-2 flex-1">
                                                    {p.title}
                                                </p>
                                                {p.isSaved && <Bookmark className="h-3.5 w-3.5 text-violet-400 shrink-0 ml-2 mt-0.5" />}
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant="violet" className="text-[10px]">{domainLabel ?? p.domain}</Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(p.createdAt)}</span>
                                                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.views}</span>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteProject(p.id) }}
                                                className="text-xs text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                Delete
                                            </button>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        )}

                        {/* Pagination */}
                        {total > 12 && (
                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page * 12 >= total}>Next</Button>
                            </div>
                        )}
                    </div>

                    {/* Selected project output */}
                    <div className="lg:col-span-2">
                        {selected ? (
                            <ProjectOutput result={selected} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-2xl border border-dashed border-white/10 space-y-3">
                                <p className="text-4xl">👈</p>
                                <p className="text-sm text-slate-500">Select a project from the list to view it</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
