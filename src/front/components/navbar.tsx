'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut, Menu, MessageCircle, UserRound } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { IbradaMark } from '@/components/brand-icons'
import { useAuth } from '@/lib/auth-context'
import { buildWhatsAppLink, navItems, site } from '@/lib/site'
import { cn } from '@/lib/utils'

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} – página inicial`}>
      <img src="/logo_retangulo_detalhe.jpg" alt="Logo do IBRADA" width={40} height={40} className="h-15 w-25" />

      <span className="flex flex-col leading-none">
        {/* <span className="font-serif text-lg font-semibold tracking-tight text-primary">{site.name}</span> */}
        <span className="hidden text-[11px] text-muted-foreground sm:block">{site.fullName}</span>
      </span>
    </Link>
  )
}

/**
 * Único lugar que define o botão de conta (entrar / logado).
 * Para trocar o ícone ou o link de quem está logado, edite só `loggedIn` e `guest`.
 */
function AccountButton({
  variant,
  className,
  labelClassName,
  onNavigate,
}: {
  variant: 'ghost' | 'outline'
  className?: string
  labelClassName?: string
  onNavigate?: () => void
}) {
  const { user } = useAuth()

  const loggedIn = {
    href: '/minha-conta',
    label: user ? `Olá, ${user.name.split(' ')[0]}` : 'Minha Conta',
    icon: <UserRound data-icon="inline-start" />,
  }
  const guest = {
    href: '/login',
    label: 'Entrar',
    icon: <UserRound data-icon="inline-start" />,
  }
  const { href, label, icon } = user ? loggedIn : guest

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(buttonVariants({ variant, size: 'lg' }), className)}
    >
      {icon}
      <span className={labelClassName}>{label}</span>
    </Link>
  )
}

function LogoutButton({
  variant,
  className,
  onNavigate,
}: {
  variant: 'ghost' | 'outline'
  className?: string
  onNavigate?: () => void
}) {
  const { user, logout } = useAuth()
  const router = useRouter()
  if (!user) return null

  const handleLogout = async () => {
    if (!window.confirm('Deseja realmente sair da sua conta?')) return
    onNavigate?.()
    await logout()
    router.push('/')
  }

  return (
    <Button variant={variant} size="lg" className={className} onClick={handleLogout}>
      <LogOut data-icon="inline-start" />
      Sair
    </Button>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // TODO: o botão deve abrir uma sobretela de triagem (perguntas guiadas) e só
  // então redirecionar ao WhatsApp com uma mensagem mais bem formulada.
  // Por enquanto abre o WhatsApp direto com uma mensagem fixa.
  const openTriage = () => {
    const link= buildWhatsAppLink('Olá, gostaria de iniciar a triagem.')
    window.open(link, '_blank')
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-18">
        <Logo />

        <nav aria-label="Navegação principal" className="ml-4 hidden flex-1 xl:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-2.5 py-2 text-sm font-medium whitespace-nowrap text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground',
                    isActive(item.href) && 'bg-secondary text-primary',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <AccountButton
            variant="ghost"
            className="hidden h-10 md:inline-flex"
            labelClassName="xl:sr-only 2xl:not-sr-only"
          />
          <LogoutButton variant="ghost" className="hidden h-10 md:inline-flex" />
          <Button
            size="lg"
            onClick={() => openTriage()}
            className="hidden h-10 bg-accent px-4 text-accent-foreground hover:bg-accent/90 sm:inline-flex"
          >
            <MessageCircle data-icon="inline-start" />
            Atendimento / Triagem
          </Button>
          <Button
            variant="outline"
            size="icon-lg"
            className="size-10 xl:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu />
          </Button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-full max-w-sm gap-0 p-0">
          <SheetHeader className="border-b p-5">
            <SheetTitle className="font-serif text-lg">Menu</SheetTitle>
            <SheetDescription>Navegue pelo site do IBRADA</SheetDescription>
          </SheetHeader>
          <nav aria-label="Navegação móvel" className="flex-1 overflow-y-auto p-3">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'flex flex-col rounded-lg px-3 py-3 transition-colors hover:bg-secondary',
                      isActive(item.href) && 'bg-secondary',
                    )}
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-2 border-t p-5">
            <Button
              size="lg"
              className="h-11 bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => {
                setMenuOpen(false)
                openTriage()
              }}
            >
              <MessageCircle data-icon="inline-start" />
              Atendimento / Triagem
            </Button>
            <AccountButton variant="outline" className="h-11" onNavigate={() => setMenuOpen(false)} />
            <LogoutButton variant="outline" className="h-11" onNavigate={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
