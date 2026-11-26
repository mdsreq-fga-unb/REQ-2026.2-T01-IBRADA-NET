"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GestorShell } from "@/components/gestor-shell";
import { Button } from "@/components/ui/button";
import { setFlashMessage } from "@/lib/api";
import { mensagemDeErro } from "@/lib/gestor-oportunidades";
import { BIOMAS_OPCOES, criarExperiencia } from "@/lib/experiencias";
import type { BiomaCategoria } from "@/types/experiencia";

const fieldClass = "min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2 disabled:bg-muted";
const labelClass = "grid gap-2 text-sm font-medium";
const dicaClass = "text-xs font-normal text-muted-foreground";

// Um link por linha (ou separado por vírgula); descarta linhas vazias e repetidas.
const lerLinks = (texto: string) =>
  Array.from(new Set(texto.split(/[\n,;]/).map((l) => l.trim()).filter(Boolean)));

// Um item por linha; descarta linhas vazias e repetidas.
const lerLinhas = (texto: string) =>
  Array.from(new Set(texto.split("\n").map((l) => l.trim()).filter(Boolean)));

const linkValido = (valor: string) => {
  try {
    const { protocol } = new URL(valor);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

export default function NovoPacotePage() {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (salvando) return;

    const dados = new FormData(event.currentTarget);
    const ler = (campo: string) => String(dados.get(campo) ?? "").trim();
    const fotos = lerLinks(ler("photos"));
    const videos = lerLinks(ler("videos"));
    const inicio = ler("startsAt");
    const fim = ler("endsAt");

    const itensInclusos = lerLinhas(ler("includedItems"));

    if (itensInclusos.length === 0) return setErro("Informe ao menos um item incluso no pacote.");
    if (fotos.length === 0) return setErro("Informe ao menos uma foto de divulgação do pacote.");
    if ([...fotos, ...videos].some((link) => !linkValido(link))) {
      return setErro("Fotos e vídeos devem ser links válidos (começando com http:// ou https://).");
    }
    if (fim < inicio) return setErro("A data de término não pode ser anterior à data de início.");

    setErro("");
    setSalvando(true);
    try {
      await criarExperiencia({
        title: ler("title"),
        description: ler("description"),
        itinerary: ler("itinerary"),
        price: ler("price"),
        // Datas fixadas em horário UTC para a data exibida no catálogo ser a mesma que o gestor escolheu.
        startsAt: `${inicio}T08:00:00.000Z`,
        endsAt: `${fim}T18:00:00.000Z`,
        capacity: Number(ler("capacity")),
        isAvailable: dados.get("isAvailable") === "on",
        location: ler("location"),
        ...(ler("community") && { community: ler("community") }),
        biome: ler("biome") as BiomaCategoria,
        difficulty: ler("difficulty") as "LEVE" | "MODERADA" | "INTENSA",
        meetingPoint: ler("meetingPoint"),
        meetingTime: ler("meetingTime"),
        includedItems: itensInclusos,
        ...(lerLinhas(ler("rules")).length > 0 && { rules: lerLinhas(ler("rules")) }),
        ...(lerLinhas(ler("clothingTips")).length > 0 && { clothingTips: lerLinhas(ler("clothingTips")) }),
        ...(ler("communityImpact") && { communityImpact: ler("communityImpact") }),
        ...(ler("guideName") && { guideName: ler("guideName") }),
        ...(ler("guideRole") && { guideRole: ler("guideRole") }),
        ...(ler("maxPerBooking") && { maxPerBooking: Number(ler("maxPerBooking")) }),
        photos: fotos,
        ...(videos.length > 0 && { videos }),
      });
    } catch (e) {
      setErro(mensagemDeErro(e, "Não foi possível cadastrar o pacote. Tente novamente."));
      setSalvando(false);
      return;
    }
    // Cadastrado: volta para a lista do gestor, que mostra o aviso de sucesso.
    setFlashMessage("Pacote cadastrado com sucesso.");
    router.push("/gestor/ecoturismo");
  }

  return (
    <GestorShell ativo="ecoturismo">
      <div className="max-w-4xl">
        <header className="mb-8">
          <Link
            href="/gestor/ecoturismo"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Ecoturismo
          </Link>
          <h1 className="font-serif text-4xl text-primary sm:text-5xl">Criar pacote</h1>
        </header>

        <form onSubmit={enviar} className="rounded-2xl border border-border bg-card p-5 sm:p-8">
          <fieldset disabled={salvando} className="grid gap-6">
            <label className={labelClass}>
              Título
              <input name="title" required pattern=".*\S.*" className={fieldClass} />
            </label>
            <label className={labelClass}>
              Descrição
              <textarea name="description" rows={3} required className={fieldClass} />
            </label>
            <label className={labelClass}>
              Roteiro
              <span className={dicaClass}>Uma etapa por linha. Ex.: 07h30 – Recepção na comunidade</span>
              <textarea name="itinerary" rows={5} required className={fieldClass} />
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className={labelClass}>
                Data de início
                <input name="startsAt" type="date" required className={fieldClass} />
              </label>
              <label className={labelClass}>
                Data de término
                <input name="endsAt" type="date" required className={fieldClass} />
              </label>
              <label className={labelClass}>
                Valor por pessoa (R$)
                <input name="price" inputMode="decimal" required placeholder="Ex. 150,50" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Vagas
                <input name="capacity" type="number" min={1} step={1} required className={fieldClass} />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className={labelClass}>
                Local de atuação
                <input name="location" required pattern=".*\S.*" placeholder="Ex. Planaltina/DF" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Comunidade anfitriã (opcional)
                <input name="community" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Bioma
                <select name="biome" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>Selecione</option>
                  {BIOMAS_OPCOES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Dificuldade
                <select name="difficulty" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>Selecione</option>
                  <option value="LEVE">Leve</option>
                  <option value="MODERADA">Moderada</option>
                  <option value="INTENSA">Intensa</option>
                </select>
              </label>
              <label className={labelClass}>
                Ponto de encontro
                <input name="meetingPoint" required pattern=".*\S.*" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Horário de encontro
                <input name="meetingTime" required pattern=".*\S.*" placeholder="Ex. 07h30" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Máximo de pessoas por reserva (opcional)
                <input name="maxPerBooking" type="number" min={1} max={50} step={1} placeholder="Padrão: 6" className={fieldClass} />
              </label>
            </div>

            <label className={labelClass}>
              O que está incluso
              <span className={dicaClass}>Um item por linha. Ex.: Guia local credenciado</span>
              <textarea name="includedItems" rows={4} required className={fieldClass} />
            </label>
            <label className={labelClass}>
              Regras de conservação (opcional)
              <span className={dicaClass}>Uma regra por linha.</span>
              <textarea name="rules" rows={3} className={fieldClass} />
            </label>
            <label className={labelClass}>
              Recomendações de vestuário (opcional)
              <span className={dicaClass}>Uma recomendação por linha.</span>
              <textarea name="clothingTips" rows={3} className={fieldClass} />
            </label>
            <label className={labelClass}>
              Impacto na comunidade (opcional)
              <textarea name="communityImpact" rows={3} className={fieldClass} />
            </label>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className={labelClass}>
                Guia local (opcional)
                <input name="guideName" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Função do guia (opcional)
                <input name="guideRole" placeholder="Ex. Guia local credenciado" className={fieldClass} />
              </label>
            </div>

            <label className={labelClass}>
              Fotos de divulgação
              <span className={dicaClass}>Um link por linha. A primeira foto é a capa do pacote.</span>
              <textarea name="photos" rows={3} required placeholder="https://..." className={fieldClass} />
            </label>
            <label className={labelClass}>
              Vídeos de divulgação (opcional)
              <span className={dicaClass}>Um link por linha, de arquivo de vídeo (ex.: .mp4).</span>
              <textarea name="videos" rows={2} placeholder="https://..." className={fieldClass} />
            </label>

            <label className="flex items-center gap-3 text-sm font-medium">
              <input name="isAvailable" type="checkbox" defaultChecked className="size-4" />
              Disponível para reserva
            </label>

            {erro && (
              <p role="alert" className="text-sm text-destructive">
                {erro}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={salvando} className="h-11 rounded-xl px-6">
                {salvando ? "Salvando…" : "Cadastrar pacote"}
              </Button>
              <Link
                href="/gestor/ecoturismo"
                className="inline-flex h-11 items-center rounded-xl border border-border px-6 text-sm font-medium hover:bg-muted"
              >
                Cancelar
              </Link>
            </div>
          </fieldset>
        </form>
      </div>
    </GestorShell>
  );
}
