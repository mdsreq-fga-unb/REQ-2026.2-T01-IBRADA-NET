"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { getCategorias, type Categoria } from "@/lib/api";
import {
  NIVEL_EDUCACAO_OPTIONS,
  STATUS_EDUCACAO_OPTIONS,
  type NivelEducacao,
  type StatusEducacao,
} from "@/lib/brasil";
import { cn } from "@/lib/utils";

export type VoluntarioFormValues = {
  categoriaIds: string[];
  educacaoNivel: NivelEducacao | "";
  educacaoCompletude: StatusEducacao | "";
  bio: string;
  outros: string;
};

type VoluntarioFieldsProps = {
  values: VoluntarioFormValues;
  onChange: (next: VoluntarioFormValues) => void;
  disabled?: boolean;
};

export function VoluntarioFields({ values, onChange, disabled = false }: VoluntarioFieldsProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoadingCategorias(true);
      setErroCategorias("");
      try {
        const list = await getCategorias();
        if (active) setCategorias(list);
      } catch (err) {
        if (active) {
          setErroCategorias(
            err instanceof Error ? err.message : "Não foi possível carregar as áreas de interesse.",
          );
        }
      } finally {
        if (active) setLoadingCategorias(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  function toggleCategoria(id: string) {
    if (disabled) return;
    const exists = values.categoriaIds.includes(id);
    const nextIds = exists
      ? values.categoriaIds.filter((item) => item !== id)
      : [...values.categoriaIds, id];
    onChange({ ...values, categoriaIds: nextIds });
  }

  return (
    <div className="space-y-5">
      {/* Áreas de interesse / Habilidades (Categoria) */}
      <div>
        <span className="block text-sm font-medium text-foreground">
          Áreas de interesse e atuação
        </span>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Selecione uma ou mais frentes em que você gostaria de contribuir com o IBRADA.
        </p>

        {loadingCategorias && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span>Carregando áreas disponíveis...</span>
          </div>
        )}

        {!loadingCategorias && erroCategorias && (
          <div
            role="alert"
            className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
          >
            <AlertCircle className="size-4 shrink-0" />
            <span>{erroCategorias}</span>
          </div>
        )}

        {!loadingCategorias && !erroCategorias && categorias.length === 0 && (
          <p className="mt-3 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            Nenhuma área de interesse cadastrada no momento. Você pode descrever suas habilidades no campo abaixo.
          </p>
        )}

        {!loadingCategorias && !erroCategorias && categorias.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Áreas de interesse">
            {categorias.map((cat) => {
              const selected = values.categoriaIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  onClick={() => toggleCategoria(cat.id)}
                  className={cn(
                    "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-card text-foreground hover:bg-secondary/70",
                  )}
                >
                  {selected && <Check className="size-3.5" aria-hidden="true" />}
                  <span>{cat.nome}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Escolaridade */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-foreground">
          Nível de escolaridade
          <select
            value={values.educacaoNivel}
            disabled={disabled}
            onChange={(e) =>
              onChange({ ...values, educacaoNivel: e.target.value as NivelEducacao | "" })
            }
            className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
          >
            <option value="">Selecione (opcional)</option>
            {NIVEL_EDUCACAO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-foreground">
          Situação da formação
          <select
            value={values.educacaoCompletude}
            disabled={disabled}
            onChange={(e) =>
              onChange({ ...values, educacaoCompletude: e.target.value as StatusEducacao | "" })
            }
            className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
          >
            <option value="">Selecione (opcional)</option>
            {STATUS_EDUCACAO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Apresentação, experiências e disponibilidade (bio) */}
      <label className="block text-sm font-medium text-foreground">
        Apresentação, experiências e disponibilidade
        <textarea
          rows={4}
          disabled={disabled}
          value={values.bio}
          onChange={(e) => onChange({ ...values, bio: e.target.value })}
          placeholder="Conte um pouco sobre sua trajetória, experiências anteriores e dias/horários em que tem disponibilidade para colaborar."
          className="mt-1.5 w-full rounded-lg border border-input bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
        />
      </label>

      {/* Outras habilidades (outros) */}
      <label className="block text-sm font-medium text-foreground">
        Outras habilidades ou conhecimentos
        <input
          type="text"
          disabled={disabled}
          value={values.outros}
          onChange={(e) => onChange({ ...values, outros: e.target.value })}
          placeholder="Ex.: Libras, fotografia, primeiros socorros, design gráfico..."
          className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
        />
      </label>
    </div>
  );
}