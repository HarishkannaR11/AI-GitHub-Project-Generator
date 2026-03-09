'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, DOMAIN_OPTIONS, formatDate } from '@/lib/utils'
import { Clock, Trash2 } from 'lucide-react'
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

interface HistoryPanelProps {
    refreshTrigger: number
    onSelect: (id: string) => void
}

export function HistoryPanel({ refreshTrigger, onSelect }: HistoryPanelProps) {
    const [projects, setProjects] = useState<ProjectRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'saved'>('all')

    const fetchProjects = async () => {
        try {
            const url = filter === 'saved' ? '/api/projects?saved=true' : '/api/projects'
            const res = await fetch(url)
            const data = await res.json()
            setProjects(data.projects ?? [])
        } catch {
            toast.error('Failed to load history')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [refreshTrigger, filter])

    const deleteProject = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('Delete this project idea?')) return
        try {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' })
            setProjects((prev) => prev.filter((p) => p.id !== id))
            toast.success('Deleted')
        } catch {
            toast.error('Failed to delete')
        }
    }

    return (
        <div className="space-y-4">
            {/* Filter tabs */}
            <div className="flex gap-2">
                {(['all', 'saved'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            'px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 capitalize',
                            filter === f
                                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        )}
                    >
                        {f === 'saved' ? '🔖 Saved' : '🕒 All'}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-4xl mb-3">🧠</p>
                    <p className="text-sm text-slate-500">
                        {filter === 'saved' ? 'No saved projects yet.' : 'No projects generated yet.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {projects.map((project) => {
                        const domainLabel = DOMAIN_OPTIONS.find((d) => d.value === project.domain)?.label
                        return (
                            <Card
                                key={project.id}
                                className="glass-hover cursor-pointer group"
                                onClick={() => onSelect(project.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0 space-y-1.5">
                                            <p className="text-sm font-medium text-white truncate group-hover:text-violet-200 transition-colors">
                                                {project.title}
                                            </p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant="violet" className="text-[10px]">
                                                    {domainLabel ?? project.domain}
                                                </Badge>
                                                {project.isSaved && (
                                                    <Badge variant="success" className="text-[10px]">
                                                        Saved
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(project.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-slate-500 hover:text-red-400"
                                                onClick={(e) => deleteProject(project.id, e)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
