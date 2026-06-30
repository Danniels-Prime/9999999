'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
          'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' &&
            'bg-gradient-to-r from-aurora-start to-aurora-end text-white hover:opacity-90 hover:scale-[1.01]',
          variant === 'secondary' &&
            'bg-stardust text-starlight border border-stardust hover:border-aurora-start',
          variant === 'ghost' &&
            'text-comet hover:text-starlight hover:bg-stardust',
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-5 py-2.5 text-base',
          size === 'lg' && 'px-7 py-3.5 text-lg',
          className
        )}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
        <span className={cn(loading && 'invisible')}>{children}</span>
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
