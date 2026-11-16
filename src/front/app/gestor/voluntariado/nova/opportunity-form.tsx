"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { NIVEL_EDUCACAO_OPTIONS, type NivelEducacao } from "@/lib/brasil";

// Separa as habilidades exigidas digitadas (vírgula, ponto e vírgula ou quebra de linha),
// do mesmo jeito que o funil lê as habilidades do perfil do voluntário.
const splitTags = (value: string) =>
  Array.from(new Set(value.split(/[,;\n]/).map((tag) => tag.trim()).filter(Boolean)));

type Option = { id: string; label: string };

export type OpportunityDraft = {
  name: string;
  description: string;
  projectId: string;
  categoryId: string;
  activities: string;
  duration: string;
  availability: string;
  skills: string[];
  funnelCriteria: {
    exigeExperiencia: boolean;
    educacaoMinima: NivelEducacao | "";
    habilidadesExigidas: string[];
  };
};

type Props = {
  projects: Option[];
  categories: Option[];
  onCreate?: (draft: OpportunityDraft) => Promise<void>;
};

const fieldClass = "min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2 disabled:bg-muted";
const labelClass = "grid gap-2 text-sm font-medium";

export function OpportunityForm({ projects, categories, onCreate }: Props) {
  const [skills, setSkills] = useState<string[]>([]);
  const [skill, setSkill] = useState("");
  const [skillError, setSkillError] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const saving = status === "saving";
  const canSubmit = Boolean(onCreate && projects.length && categories.length);

  function addSkill() {
    const value = skill.trim();
    if (!value) return;

    setSkills((current) => current.includes(value) ? current : [...current, value]);
    setSkill("");
    setSkillError(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onCreate || !canSubmit || saving) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const read = (field: string) => String(data.get(field) ?? "").trim();
    const pendingSkill = skill.trim();
    const submittedSkills = pendingSkill && !skills.includes(pendingSkill)
      ? [...skills, pendingSkill]
      : skills;

    if (!submittedSkills.length) {
      setSkillError(true);
      form.querySelector<HTMLInputElement>("#opportunity-skill")?.focus();
      return;
    }

    setStatus("saving");
    try {
      await onCreate({
        name: read("name"),
        description: read("description"),
        projectId: read("projectId"),
        categoryId: read("categoryId"),
        activities: read("activities"),
        duration: read("duration"),
        availability: read("availability"),
        skills: submittedSkills,
        funnelCriteria: {
          exigeExperiencia: data.get("exigeExperiencia") === "on",
          educacaoMinima: read("educacaoMinima") as NivelEducacao | "",
          habilidadesExigidas: splitTags(read("habilidadesExigidas")),
        },
      });
      form.reset();
      setSkills([]);
      setSkill("");
      setStatus("success");
    } catch (error) {
      // A página de origem já traduz sessão expirada, acesso negado e erros de validação.
      setErrorMessage(error instanceof Error && error.message ? error.message : "Não foi possível criar a oportunidade. Tente novamente.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 sm:p-8">
      <fieldset disabled={saving} className="grid gap-6">
        <label className={labelClass}>
          Nome da oportunidade
          <input name="name" required pattern={".*\\S.*"} className={fieldClass} />
        </label>

        <label className={labelClass}>
          Descrição
          <textarea name="description" rows={3} required className={fieldClass} />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className={labelClass}>
            Projeto associado
            <select name="projectId" defaultValue="" required disabled={!projects.length} className={fieldClass}>
              <option value="" disabled>{projects.length ? "Selecione um projeto" : "Nenhum projeto cadastrado"}</option>
              {projects.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Categoria
            <select name="categoryId" defaultValue="" required disabled={!categories.length} className={fieldClass}>
              <option value="" disabled>{categories.length ? "Selecione uma categoria" : "Nenhuma categoria disponível"}</option>
              {categories.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
            </select>
          </label>
        </div>

        <label className={labelClass}>
          Atividades planejadas
          <textarea name="activities" rows={4} required className={fieldClass} />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className={labelClass}>
            Duração
            <input name="duration" required pattern={".*\\S.*"} placeholder="Ex. 3 meses" className={fieldClass} />
          </label>
          <label className={labelClass}>
            Disponibilidade
            <input name="availability" required pattern={".*\\S.*"} placeholder="Ex. sábados pela manhã" className={fieldClass} />
          </label>
        </div>

        <div className="grid gap-2">
          <label htmlFor="opportunity-skill" className="text-sm font-medium">Habilidades requeridas</label>
          <div className="flex gap-2">
            <input
              id="opportunity-skill"
              className={`${fieldClass} min-w-0 flex-1`}
              value={skill}
              aria-invalid={skillError}
              aria-describedby={skillError ? "opportunity-skill-error" : undefined}
              onChange={(event) => setSkill(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button type="button" variant="outline" className="h-11" disabled={!skill.trim()} onClick={addSkill}>
              Adicionar
            </Button>
          </div>
          {skillError && <p id="opportunity-skill-error" role="alert" className="text-sm text-destructive">Informe pelo menos uma habilidade.</p>}
          {skills.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {skills.map((value) => (
                <li key={value}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="max-w-full whitespace-normal"
                    aria-label={`Remover habilidade ${value}`}
                    onClick={() => setSkills((current) => current.filter((item) => item !== value))}
                  >
                    {value} <span aria-hidden="true">×</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <fieldset className="rounded-xl border border-border p-4">
          <legend className="px-2 text-sm font-medium">Critérios do funil (opcional)</legend>
          <p className="mb-4 px-2 text-sm text-muted-foreground">
            Usados para separar os candidatos aptos. Sem critérios, todos os candidatos ficam aptos.
          </p>
          <div className="grid gap-5">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="exigeExperiencia" className="size-4 accent-primary" />
              Exigir experiência prévia na área
            </label>
            <label className={labelClass}>
              Escolaridade mínima
              <select name="educacaoMinima" defaultValue="" className={fieldClass}>
                <option value="">Sem exigência</option>
                {NIVEL_EDUCACAO_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Habilidades exigidas
              <input
                name="habilidadesExigidas"
                placeholder="Separe por vírgula. Ex. Primeiros socorros, Botânica"
                className={fieldClass}
              />
              <span className="text-xs font-normal text-muted-foreground">
                O candidato precisa ter declarado cada uma delas em &quot;outras habilidades&quot; no perfil.
              </span>
            </label>
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          {!canSubmit && (
            <p className="text-sm text-muted-foreground">
              {onCreate && categories.length && !projects.length
                ? "Nenhum projeto cadastrado. Peça à equipe de desenvolvimento para cadastrar o projeto antes de criar a oportunidade."
                : "O envio está indisponível no momento."}
            </p>
          )}
          {status === "error" && <p role="alert" className="text-sm text-destructive">{errorMessage}</p>}
          {status === "success" && <p role="status" className="text-sm text-primary">Oportunidade criada com sucesso.</p>}
          <Button type="submit" disabled={!canSubmit || saving} className="ml-auto h-11 px-5">
            {saving ? "Criando oportunidade…" : "Criar oportunidade"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
