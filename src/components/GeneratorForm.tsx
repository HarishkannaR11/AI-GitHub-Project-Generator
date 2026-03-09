'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, DOMAIN_OPTIONS, SKILL_SUGGESTIONS } from '@/lib/utils'
import type { GenerateResponse } from '@/types'
import { ChevronDown, Loader2, Sparkles, X } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface GeneratorFormProps {
    onResult: (result: GenerateResponse) => void
    onLoading: (loading: boolean) => void
    isLoading: boolean
}

export function GeneratorForm({ onResult, onLoading, isLoading }: GeneratorFormProps) {
    const [skills, setSkills] = useState<string[]>([])
    const [skillInput, setSkillInput] = useState('')
    const [domain, setDomain] = useState('')
    const [domainOpen, setDomainOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const filteredSuggestions = SKILL_SUGGESTIONS.filter(
        (s) => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s)
    ).slice(0, 6)

    const addSkill = (skill: string) => {
        const trimmed = skill.trim()
        if (trimmed && !skills.includes(trimmed) && skills.length < 12) {
            setSkills((prev) => [...prev, trimmed])
            setSkillInput('')
            inputRef.current?.focus()
        }
    }

    const removeSkill = (skill: string) => {
        setSkills((prev) => prev.filter((s) => s !== skill))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
            e.preventDefault()
            addSkill(skillInput)
        } else if (e.key === 'Backspace' && !skillInput && skills.length) {
            setSkills((prev) => prev.slice(0, -1))
        }
    }

    const handleGenerate = async () => {
        if (skills.length === 0) {
            toast.error('Add at least one skill.')
            return
        }
        if (!domain) {
            toast.error('Select a domain / interest area.')
            return
        }

        onLoading(true)
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skills: skills.join(', '), domain }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Generation failed')
            onResult(data)
            toast.success('Project idea generated!')
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong'
            toast.error(message)
        } finally {
            onLoading(false)
        }
    }

    const selectedDomainLabel = DOMAIN_OPTIONS.find((d) => d.value === domain)?.label

    return (
        <div className="space-y-6">
            {/* Skills Input */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">
                    Your Skills
                    <span className="ml-2 text-xs text-slate-500">({skills.length}/12)</span>
                </label>

                {/* Tag input container */}
                <div
                    className={cn(
                        'min-h-[52px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2',
                        'flex flex-wrap gap-2 items-center cursor-text transition-all duration-200',
                        'focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20'
                    )}
                    onClick={() => inputRef.current?.focus()}
                >
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="inline-flex items-center gap-1 rounded-lg bg-violet-500/20 border border-violet-500/30 px-2.5 py-1 text-xs font-medium text-violet-300 animate-bounce-in"
                        >
                            {skill}
                            <button
                                onClick={(e) => { e.stopPropagation(); removeSkill(skill) }}
                                className="text-violet-400 hover:text-white transition-colors ml-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                    <Input
                        ref={inputRef}
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={skills.length === 0 ? 'Type a skill and press Enter...' : '+ Add more'}
                        className="flex-1 min-w-[160px] border-0 bg-transparent p-0 text-sm focus-visible:ring-0 h-auto"
                    />
                </div>

                {/* Autocomplete suggestions */}
                {skillInput && filteredSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {filteredSuggestions.map((s) => (
                            <button
                                key={s}
                                onClick={() => addSkill(s)}
                                className="rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-1 text-xs text-slate-400 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300 transition-all duration-150"
                            >
                                + {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* Quick-add popular skills */}
                {skills.length === 0 && !skillInput && (
                    <div className="space-y-1.5">
                        <p className="text-xs text-slate-500">Popular:</p>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'Python', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => addSkill(s)}
                                    className="rounded-lg border border-dashed border-white/15 bg-white/3 px-3 py-1 text-xs text-slate-500 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-300 transition-all duration-150"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Domain Selector */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Interest Area / Domain</label>
                <div className="relative">
                    <button
                        onClick={() => setDomainOpen((o) => !o)}
                        className={cn(
                            'w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all duration-200',
                            'hover:border-white/20 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20',
                            domain ? 'text-white' : 'text-slate-500'
                        )}
                    >
                        <span>{selectedDomainLabel ?? 'Select a domain...'}</span>
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-slate-400 transition-transform duration-200',
                                domainOpen && 'rotate-180'
                            )}
                        />
                    </button>

                    {domainOpen && (
                        <div className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl border border-white/10 bg-[#13132a] shadow-2xl shadow-black/50 overflow-hidden animate-fade-up">
                            <div className="max-h-64 overflow-y-auto p-1">
                                {DOMAIN_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setDomain(opt.value); setDomainOpen(false) }}
                                        className={cn(
                                            'w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-150',
                                            domain === opt.value
                                                ? 'bg-violet-500/20 text-violet-300'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Button */}
            <Button
                variant="gradient"
                size="xl"
                className="w-full"
                onClick={handleGenerate}
                disabled={isLoading || skills.length === 0 || !domain}
                id="generate-btn"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating your project idea...
                    </>
                ) : (
                    <>
                        <Sparkles className="h-5 w-5" />
                        Generate Project Idea
                    </>
                )}
            </Button>
        </div>
    )
}
