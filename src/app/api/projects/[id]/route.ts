import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

// GET /api/projects/[id]
export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { id } = await params
        const project = await prisma.generatedProject.findUnique({ where: { id } })
        if (!project) {
            return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
        }

        // Increment view count
        await prisma.generatedProject.update({
            where: { id },
            data: { views: { increment: 1 } },
        })

        return NextResponse.json(project)
    } catch (err) {
        console.error('[projects/[id]:GET] Error:', err)
        return NextResponse.json({ error: 'Failed to fetch project.' }, { status: 500 })
    }
}

// PATCH /api/projects/[id] — toggle saved / public
export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params
        const body = await req.json()
        const { isSaved, isPublic } = body

        const updated = await prisma.generatedProject.update({
            where: { id },
            data: {
                ...(isSaved !== undefined && { isSaved }),
                ...(isPublic !== undefined && { isPublic }),
            },
        })

        return NextResponse.json(updated)
    } catch (err) {
        console.error('[projects/[id]:PATCH] Error:', err)
        return NextResponse.json({ error: 'Failed to update project.' }, { status: 500 })
    }
}

// DELETE /api/projects/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const { id } = await params
        await prisma.generatedProject.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[projects/[id]:DELETE] Error:', err)
        return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 })
    }
}
