import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date))
}

export function truncate(str: string, length: number): string {
    return str.length > length ? str.slice(0, length) + '...' : str
}

export const SKILL_SUGGESTIONS = [
    'React',
    'Next.js',
    'TypeScript',
    'Python',
    'Node.js',
    'FastAPI',
    'Django',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Kubernetes',
    'GraphQL',
    'REST APIs',
    'Machine Learning',
    'TensorFlow',
    'PyTorch',
    'OpenCV',
    'NLP',
    'Tailwind CSS',
    'Vue.js',
    'Angular',
    'Go',
    'Rust',
    'AWS',
    'Firebase',
    'Supabase',
    'Prisma',
    'Socket.io',
    'WebRTC',
]

export const DOMAIN_OPTIONS = [
    { value: 'web-development', label: '🌐 Web Development' },
    { value: 'mobile-app', label: '📱 Mobile App' },
    { value: 'ai-ml', label: '🤖 AI / Machine Learning' },
    { value: 'devops', label: '⚙️ DevOps & Cloud' },
    { value: 'cybersecurity', label: '🔒 Cybersecurity' },
    { value: 'data-engineering', label: '📊 Data Engineering' },
    { value: 'blockchain', label: '⛓️ Blockchain / Web3' },
    { value: 'iot', label: '🌍 IoT & Embedded' },
    { value: 'game-dev', label: '🎮 Game Development' },
    { value: 'open-source', label: '🛠️ Open Source Tools' },
    { value: 'fintech', label: '💰 FinTech' },
    { value: 'healthtech', label: '🏥 HealthTech' },
    { value: 'edtech', label: '🎓 EdTech' },
    { value: 'social-media', label: '📡 Social Media' },
    { value: 'ecommerce', label: '🛒 E-Commerce' },
]
