export const UFS = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
] as const;

export type NivelEducacao =
  | "FUNDAMENTAL"
  | "MEDIO"
  | "GRADUACAO"
  | "POS_GRADUACAO"
  | "MESTRADO"
  | "DOUTORADO";

export type StatusEducacao = "COMPLETO" | "EM_ANDAMENTO" | "INCOMPLETO";

export const NIVEL_EDUCACAO_OPTIONS: { value: NivelEducacao; label: string }[] = [
  { value: "FUNDAMENTAL", label: "Ensino Fundamental" },
  { value: "MEDIO", label: "Ensino Médio" },
  { value: "GRADUACAO", label: "Graduação" },
  { value: "POS_GRADUACAO", label: "Pós-graduação / Especialização" },
  { value: "MESTRADO", label: "Mestrado" },
  { value: "DOUTORADO", label: "Doutorado" },
];

export const STATUS_EDUCACAO_OPTIONS: { value: StatusEducacao; label: string }[] = [
  { value: "COMPLETO", label: "Completo" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "INCOMPLETO", label: "Incompleto" },
];