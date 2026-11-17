import { cn } from '@/lib/utils'

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-xs font-semibold tracking-[0.18em] text-earth uppercase', className)}>{children}</p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn('flex max-w-2xl flex-col gap-3', align === 'center' && 'mx-auto items-center text-center', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl leading-tight font-semibold text-foreground md:text-4xl">{title}</h2>
      {description && <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
    </div>
  )
}

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <section className="border-b bg-secondary/50">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-14 sm:px-6 md:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold md:text-5xl">{title}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>
        {children}
      </div>
    </section>
  )
}
