export const site = {
  name: 'IBRADA',
  fullName: 'Instituto Brasileiro de Direito Ambiental',
  legalName: 'Instituto Brasileiro de Direito Ambiental – IBRADA (OSCIP)',
  cnpj: '06.984.927/0001-90',
  address: 'SHS, Quadra 6 conjunto e bloco A, n.130, salas 501 a 512, Asa Sul, Brasília/DF, CEP 70.316-102',
  email: 'ibrada.org.br@gmail.com',
  phoneDisplay: '(61) 981150274',
  whatsappNumber: '5561981150274',
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

// Versão vigente dos Termos de Uso e da Política de Privacidade (RF29).
// Atualize ao alterar o texto de app/termos/page.tsx e registre em docs/documentacao/termos.md.
export const terms = {
  version: '1.0',
  updatedAt: '05/11/2026',
}
