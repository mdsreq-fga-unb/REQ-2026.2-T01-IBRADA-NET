export const site = {
  name: 'IBRADA',
  fullName: 'Instituto Brasileiro de Direito Ambiental',
  legalName: 'Instituto Brasileiro de Direito Ambiental – IBRADA (OSCIP)',
  cnpj: '00.000.000/0001-00',
  address: 'SCS Quadra 2, Bloco C, Sala 101 – Asa Sul, Brasília/DF – CEP 70302-000',
  email: 'contato@ibrada.org.br',
  phoneDisplay: '(61) 99999-0000',
  whatsappNumber: '5561999990000',
}

export const navItems = [
  {
    href: '/quem-somos',
    label: 'Quem Somos',
    description: 'História, diretoria e transparência',
  },
  {
    href: '/atuacao',
    label: 'Atuação & Projetos',
    description: 'Regularização fundiária, agroecologia e inclusão social',
  },
  {
    href: '/ecoturismo',
    label: 'Ecoturismo Comunitário',
    description: 'Vivências no Cerrado e trilhas ecológicas',
  },
  {
    href: '/voluntariado',
    label: 'Voluntariado',
    description: 'Oportunidades abertas e programa de voluntariado',
  },
  {
    href: '/parcerias',
    label: 'Parcerias',
    description: 'Empresas, editais e captação de recursos',
  },
]

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
}
