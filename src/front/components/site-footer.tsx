import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { IbradaMark } from '@/components/brand-icons'
import { navItems, site } from '@/lib/site'

const socials = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
]

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <IbradaMark className="size-10 [&_rect]:fill-primary-foreground/15" />
            <span className="font-serif text-xl font-semibold">{site.name}</span>
          </div>
          <p className="text-sm leading-relaxed text-primary-foreground/80">
            Organização da Sociedade Civil de Interesse Público (OSCIP) que une direito ambiental, inclusão de
            comunidades e conservação dos biomas brasileiros.
          </p>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold tracking-wide uppercase">Navegação</h2>
          <ul className="flex flex-col gap-2 text-sm text-primary-foreground/80">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-primary-foreground hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold tracking-wide uppercase">Contato</h2>
          <ul className="flex flex-col gap-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{site.address}</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <a href={`mailto:${site.email}`} className="hover:text-primary-foreground hover:underline">
                {site.email}
              </a>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <span>{site.phoneDisplay}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold tracking-wide uppercase">Redes sociais</h2>
          <ul className="flex flex-wrap gap-2 text-sm">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-primary-foreground/25 px-3 py-1.5 transition-colors hover:bg-primary-foreground/10"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-primary-foreground/70 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            {site.legalName} · CNPJ {site.cnpj}
          </p>
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href="/termos#termos-de-uso" className="hover:text-primary-foreground hover:underline">
                Termos de Uso
              </Link>
            </li>
            <li>
              <Link href="/termos#privacidade" className="hover:text-primary-foreground hover:underline">
                Política de Privacidade (LGPD)
              </Link>
            </li>
            <li>
              <Link href="/quem-somos#transparencia" className="hover:text-primary-foreground hover:underline">
                Transparência
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
