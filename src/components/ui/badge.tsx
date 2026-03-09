import { cn } from '@/lib/utils'
import * as React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'violet' | 'indigo' | 'success'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                {
                    'border-transparent bg-primary text-primary-foreground hover:bg-primary/80': variant === 'default',
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
                    'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80': variant === 'destructive',
                    'text-foreground': variant === 'outline',
                    'border-transparent bg-violet-500/20 text-violet-300 hover:bg-violet-500/30': variant === 'violet',
                    'border-transparent bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30': variant === 'indigo',
                    'border-transparent bg-emerald-500/20 text-emerald-300': variant === 'success',
                },
                className
            )}
            {...props}
        />
    )
}

export { Badge }

