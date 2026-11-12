"use client";

import { useState } from "react";
import Link from "next/link";
import { Folder, Clock, MapPin, ArrowRight } from "lucide-react";

type Area = "Todas" | "Jurídico" | "Comunicação" | "Campo" | "Educação Ambiental";
type Formato = "Todos" | "Presencial" | "Remoto" | "Híbrido";

interface Oportunidade {
  id: string;
  area: string;
  formato: string;
  titulo: string;
  projeto: string;
  duracao: string;
  local: string;
  requisitos: string[];
}

const mockOportunidades: Oportunidade[] = [
  {
    id: "1",
    area: "Jurídico",
    formato: "Híbrido",
    titulo: "Apoio jurídico em regularização fundiária",
    projeto: "Terra Legal Cerrado",
    duracao: "6h por semana · 6 meses",
    local: "Brasília/DF",
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

const areas: Area[] = ["Todas", "Jurídico", "Comunicação", "Campo", "Educação Ambiental"];
const formatos: Formato[] = ["Todos", "Presencial", "Remoto", "Híbrido"];

export default function VoluntariadoPage() {
  const [areaSelecionada, setAreaSelecionada] = useState<Area>("Todas");
  const [formatoSelecionado, setFormatoSelecionado] = useState<Formato>("Todos");

  // Filtra oportunidades com botões
  const oportunidadesFiltradas = mockOportunidades.filter((op) => {
    const matchArea = areaSelecionada === "Todas" || op.area === areaSelecionada;
    const matchFormato = formatoSelecionado === "Todos" || op.formato === formatoSelecionado;
    return matchArea && matchFormato;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* HEADER DA PÁGINA */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-4 block">
          Programa de Voluntariado
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6 max-w-2xl">
          Doe seu tempo e talento para quem cuida da terra
        </h1>
        <p className="text-muted-foreground max-w-2xl mb-8 leading-relaxed">
          Escolha uma vaga por área ou formato. Se nenhuma combinar com você, faça seu cadastro no
          banco de voluntários e avisamos quando surgir uma oportunidade.
        </p>
        <button className="border border-border text-foreground hover:bg-muted transition-colors rounded-full px-6 py-2.5 text-sm font-medium">
          Cadastrar no banco de voluntários
        </button>
      </section>

      {/* FILTROS */}
      <section className="max-w-5xl mx-auto px-6 mb-8">
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm font-medium w-16">Área</span>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => setAreaSelecionada(area)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    areaSelecionada === area
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-sm font-medium w-16">Formato</span>
            <div className="flex flex-wrap gap-2">
              {formatos.map((formato) => (
                <button
                  key={formato}
                  onClick={() => setFormatoSelecionado(formato)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    formatoSelecionado === formato
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {formato}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTADOR DE RESULTADOS */}
      <section className="max-w-5xl mx-auto px-6 mb-6">
        <p className="text-sm text-muted-foreground">
          {oportunidadesFiltradas.length} oportunidades encontradas
        </p>
      </section>

      {/* Grid ded oportunidades */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {oportunidadesFiltradas.map((op) => (
            <div
              key={op.id}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-md">
                    {op.area}
                  </span>
                  <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-md">
                    {op.formato}
                  </span>
                </div>

                {/* Título e Detalhes */}
                <h3 className="text-xl font-serif text-foreground mb-4">{op.titulo}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Folder className="w-4 h-4" />
                    <span>Projeto: {op.projeto}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{op.duracao}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{op.local}</span>
                  </div>
                </div>

                <hr className="border-border mb-6" />

                {/* Requisitos */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-3 block">
                    Requisitos
                  </span>
                  <ul className="list-disc list-outside ml-4 space-y-1">
                    {op.requisitos.map((req, index) => (
                      <li key={index} className="text-sm text-foreground">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ação */}
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group mt-4"
              >
                Ver detalhes e candidatar-se
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
        
        {oportunidadesFiltradas.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma oportunidade encontrada com os filtros selecionados.
          </div>
        )}
      </section>
    </div>
  );
}