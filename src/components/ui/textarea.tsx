import { cn } from '@/lib/utils'
import * as React from 'react'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    'flex min-h-[80px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none',
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = 'Textarea'

export { Textarea }

