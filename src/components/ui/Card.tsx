import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
}

function Card({ className, elevated, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-nebula border border-stardust p-6',
        elevated && 'shadow-lg shadow-black/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card }
