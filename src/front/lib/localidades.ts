export const unidadesFederativas = [
  ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"],
  ["BA", "Bahia"], ["CE", "Ceará"], ["DF", "Distrito Federal"],
  ["ES", "Espírito Santo"], ["GO", "Goiás"], ["MA", "Maranhão"],
  ["MT", "Mato Grosso"], ["MS", "Mato Grosso do Sul"], ["MG", "Minas Gerais"],
  ["PA", "Pará"], ["PB", "Paraíba"], ["PR", "Paraná"], ["PE", "Pernambuco"],
  ["PI", "Piauí"], ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"],
  ["RS", "Rio Grande do Sul"], ["RO", "Rondônia"], ["RR", "Roraima"],
  ["SC", "Santa Catarina"], ["SP", "São Paulo"], ["SE", "Sergipe"],
  ["TO", "Tocantins"],
] as const;

export type Municipio = { id: number; nome: string };

export async function listarMunicipios(uf: string, signal: AbortSignal): Promise<Municipio[]> {
  const resposta = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${encodeURIComponent(uf)}/municipios?orderBy=nome`,
    { signal },
  );
  if (!resposta.ok) throw new Error("Não foi possível consultar os municípios do IBGE.");
  const municipios: Municipio[] = await resposta.json();
  if (!municipios.length) throw new Error("Nenhum município foi encontrado.");
  return municipios;
}
