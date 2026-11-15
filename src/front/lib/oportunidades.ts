export type Oportunidade = {
  id: string;
  area: string;
  formato: string;
  titulo: string;
  projeto: string;
  duracao: string;
  local: string;
  requisitos: string[];
  descricao?: string;
  atividades?: string[];
};

export const oportunidades: Oportunidade[] = [
  {
    id: "1",
    area: "Jurídico",
    formato: "Híbrido",
    titulo: "Apoio jurídico em regularização fundiária",
    projeto: "Terra Legal Cerrado",
    duracao: "6h por semana · 6 meses",
    local: "Brasília/DF",
    descricao:
      "O projeto Terra Legal Cerrado ajuda famílias de agricultores a conseguirem o título da sua terra e a regularizar a situação ambiental das propriedades.",
    atividades: [
      "Apoiar a análise de documentos de posse de famílias agricultoras",
      "Auxiliar na elaboração do CAR (Cadastro Ambiental Rural)",
      "Participar de mutirões de atendimento nas comunidades",
    ],
    requisitos: [
      "Estudante (a partir do 6º semestre) ou formado em Direito",
      "Interesse em direito agrário e ambiental",
    ],
  },
  {
    id: "2",
    area: "Comunicação",
    formato: "Remoto",
    titulo: "Comunicação e redes sociais",
    projeto: "Vozes do Cerrado",
    duracao: "4h por semana · 3 meses",
    local: "Remoto",
    requisitos: [
      "Experiência com produção de conteúdo",
      "Noções de edição de vídeo ou design",
    ],
  },
  {
    id: "3",
    area: "Campo",
    formato: "Presencial",
    titulo: "Mutirão de recuperação de nascentes",
    projeto: "Águas do Cerrado",
    duracao: "1 sábado por mês · Contínuo",
    local: "Planaltina/DF",
    requisitos: [
      "Disposição para atividades ao ar livre",
      "Maior de 16 anos (menores com responsável)",
    ],
  },
  {
    id: "4",
    area: "Educação Ambiental",
    formato: "Presencial",
    titulo: "Educador(a) ambiental em escolas rurais",
    projeto: "Escola Viva",
    duracao: "8h por semana · 1 semestre letivo",
    local: "Região do Entorno do DF",
    requisitos: [
      "Formação ou estudo em Pedagogia, Biologia ou áreas afins",
      "Gostar de trabalhar com crianças",
    ],
  },
  {
    id: "5",
    area: "Campo",
    formato: "Presencial",
    titulo: "Monitoramento de fauna e flora",
    projeto: "Águas do Cerrado",
    duracao: "2 expedições por mês · 3 meses",
    local: "Cavalcante/GO",
    requisitos: [
      "Estudante ou formado em Biologia, Eng. Florestal ou afins",
      "Disponibilidade para viagens curtas",
    ],
  },
  {
    id: "6",
    area: "Comunicação",
    formato: "Remoto",
    titulo: "Redação de projetos para editais",
    projeto: "Captação Institucional",
    duracao: "5h por semana · 4 meses",
    local: "Remoto",
    requisitos: [
      "Boa escrita",
      "Experiência com elaboração de projetos é um diferencial",
    ],
  },
];

export function buscarOportunidade(id: string) {
  return oportunidades.find((oportunidade) => oportunidade.id === id);
}
