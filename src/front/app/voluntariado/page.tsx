import type { Metadata } from 'next'
import { PageIntro } from '@/components/page-intro'
import { OpportunityList } from '@/components/voluntariado/opportunity-list'
import { BancoVoluntariosButton } from '@/components/voluntariado/banco-voluntarios-button'

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
        <BancoVoluntariosButton />
      </PageIntro>
      <section aria-label="Oportunidades abertas" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <OpportunityList />
      </section>
    </>
  )
}
