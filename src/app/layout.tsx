import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'AI GitHub Project Generator',
    description:
        'Generate high-quality, portfolio-worthy GitHub project ideas tailored to your skills and interests using AI.',
    keywords: ['GitHub', 'Project Ideas', 'AI', 'Portfolio', 'CS Students', 'Developer Tools'],
    openGraph: {
        title: 'AI GitHub Project Generator',
        description: 'Generate portfolio-worthy GitHub project ideas with AI',
        type: 'website',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="min-h-screen bg-[#080812] font-sans antialiased">
                {children}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#1a1a2e',
                            color: '#e2e8f0',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                        },
                        success: {
                            iconTheme: { primary: '#8b5cf6', secondary: '#ffffff' },
                        },
                    }}
                />
            </body>
        </html>
    )
}
