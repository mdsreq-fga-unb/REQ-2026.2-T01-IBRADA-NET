import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/page-intro'
import { OpportunityList } from '@/components/voluntariado/opportunity-list'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Voluntariado',
  description: 'Oportunidades de voluntariado abertas no IBRADA.',
}

export default function VoluntariadoPage() {
  return (
    <>
      <PageIntro
        eyebrow="Programa de voluntariado"
        title="Doe seu tempo e talento para quem cuida da terra"
        description="Escolha uma vaga por área. Se nenhuma combinar com você, faça seu cadastro no banco de voluntários e avisamos quando surgir uma oportunidade."
      >
        <Link
          href="/cadastro"
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'mt-2 h-11 w-fit bg-card px-5')}
        >
          Cadastrar no banco de voluntários
        </Link>
      </PageIntro>
      <section aria-label="Oportunidades abertas" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <OpportunityList />
      </section>
    </>
  )
}
