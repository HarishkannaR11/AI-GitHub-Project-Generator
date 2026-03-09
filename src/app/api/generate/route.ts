import { openai } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { buildProjectPrompt } from '@/lib/prompt'
import type { GenerateRequest } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
    try {
        const body: GenerateRequest = await req.json()
        const { skills, domain } = body

        if (!skills?.trim() || !domain?.trim()) {
            return NextResponse.json(
                { error: 'Skills and domain are required.' },
                { status: 400 }
            )
        }

        const prompt = buildProjectPrompt(skills.trim(), domain.trim())

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a senior software architect and startup product strategist. Always respond with well-structured markdown exactly following the format provided. Never skip sections.',
                },
                { role: 'user', content: prompt },
            ],
            temperature: 0.8,
            max_tokens: 4000,
        })

        const content = completion.choices[0]?.message?.content ?? ''

        // Extract title from the generated content
        const titleMatch = content.match(/##\s*1\.\s*Project Title\s*\n+([^\n#]+)/)
        const title = titleMatch ? titleMatch[1].trim() : 'Untitled Project'

        // Persist to DB
        const record = await prisma.generatedProject.create({
            data: {
                title,
                skills: skills.trim(),
                domain: domain.trim(),
                content,
            },
        })

        return NextResponse.json({
            id: record.id,
            content: record.content,
            title: record.title,
            skills: record.skills,
            domain: record.domain,
            createdAt: record.createdAt.toISOString(),
        })
    } catch (err) {
        console.error('[generate] Error:', err)
        return NextResponse.json(
            { error: 'Failed to generate project idea. Please try again.' },
            { status: 500 }
        )
    }
}
