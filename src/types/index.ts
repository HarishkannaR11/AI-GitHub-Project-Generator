export interface GenerateRequest {
    skills: string
    domain: string
}

export interface GenerateResponse {
    id: string
    content: string
    title: string
    skills: string
    domain: string
    createdAt: string
}

export interface ProjectRecord {
    id: string
    title: string
    skills: string
    domain: string
    content: string
    isSaved: boolean
    isPublic: boolean
    views: number
    createdAt: string
    updatedAt: string
}

export interface ApiError {
    error: string
    detail?: string
}
