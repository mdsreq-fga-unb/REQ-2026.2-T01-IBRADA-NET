"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { enviarParceria } from "@/lib/parcerias";

const fieldClass = "min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2 disabled:bg-muted";
const labelClass = "grid gap-2 text-sm font-medium";

// Mesmo formato aceito pelo back (14 dígitos, com ou sem pontuação).
const CNPJ_REGEX = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VAZIO = { organization: "", cnpj: "", contactName: "", contactEmail: "", contactPhone: "", proposal: "" };

export default function ParceriasPage() {
  const [form, setForm] = useState(VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const campo = (nome: keyof typeof VAZIO) => ({
    name: nome,
    value: form[nome],
    onChange: (e: { target: { value: string } }) => {
      setForm((atual) => ({ ...atual, [nome]: e.target.value }));
      setSucesso("");
    },
  });

  const cnpjInvalido = form.cnpj.trim() !== "" && !CNPJ_REGEX.test(form.cnpj.trim());
  const emailInvalido = form.contactEmail.trim() !== "" && !EMAIL_REGEX.test(form.contactEmail.trim());
  // Botão bloqueado enquanto faltar campo de identificação (US19) ou a proposta.
  const completo =
    form.organization.trim() !== "" &&
    form.contactName.trim() !== "" &&
    EMAIL_REGEX.test(form.contactEmail.trim()) &&
    form.proposal.trim() !== "" &&
    !cnpjInvalido;

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!completo || enviando) return;

    setEnviando(true);
    setErro("");
    setSucesso("");
    try {
      const resposta = await enviarParceria({
        organization: form.organization.trim(),
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim(),
        proposal: form.proposal.trim(),
        ...(form.cnpj.trim() && { cnpj: form.cnpj.trim() }),
        ...(form.contactPhone.trim() && { contactPhone: form.contactPhone.trim() }),
      });
      setSucesso(resposta.message);
      setForm(VAZIO);
    } catch (e) {
      setErro(
        e instanceof ApiError && (e.status === 400 || e.status === 0) && e.message
          ? e.message
          : "Não foi possível enviar a solicitação. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <header className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-earth">Parcerias</p>
        <h1 className="font-serif text-4xl text-primary sm:text-5xl">Seja parceiro do IBRADA</h1>
        <p className="mt-3 text-muted-foreground">
          Conte quem você é e como gostaria de colaborar. Nossa equipe analisa cada proposta e retorna pelos contatos informados.
          Não é preciso criar conta.
        </p>
      </header>

      {sucesso && (
        <p
          role="status"
          className="mb-6 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950"
        >
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-700" />
          {sucesso}
        </p>
      )}

      <form onSubmit={enviar} noValidate className="rounded-2xl border border-border bg-card p-5 sm:p-8">
        <fieldset disabled={enviando} className="grid gap-6">
          <legend className="sr-only">Dados da solicitação de parceria</legend>

          <label className={labelClass}>
            Razão social ou nome da instituição
            <input {...campo("organization")} required maxLength={191} className={fieldClass} />
          </label>

          <label className={labelClass}>
            CNPJ (opcional)
            <input
              {...campo("cnpj")}
              inputMode="numeric"
              placeholder="12.345.678/0001-90"
              aria-invalid={cnpjInvalido}
              className={fieldClass}
            />
            {cnpjInvalido && <span role="alert" className="text-xs font-normal text-destructive">O CNPJ deve ter 14 dígitos.</span>}
          </label>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className={labelClass}>
              Nome do responsável
              <input {...campo("contactName")} required maxLength={191} className={fieldClass} />
            </label>
            <label className={labelClass}>
              E-mail de contato institucional
              <input
                {...campo("contactEmail")}
                type="email"
                required
                maxLength={191}
                aria-invalid={emailInvalido}
                className={fieldClass}
              />
              {emailInvalido && <span role="alert" className="text-xs font-normal text-destructive">Informe um e-mail válido.</span>}
            </label>
          </div>

          <label className={labelClass}>
            Telefone (opcional)
            <input {...campo("contactPhone")} type="tel" maxLength={191} className={fieldClass} />
          </label>

          <label className={labelClass}>
            Proposta de parceria
            <span className="text-xs font-normal text-muted-foreground">Descreva o tipo de parceria que você gostaria de sugerir ou desenvolver.</span>
            <textarea {...campo("proposal")} rows={6} required maxLength={5000} className={fieldClass} />
          </label>

          {erro && (
            <p role="alert" className="text-sm text-destructive">
              {erro}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={!completo || enviando} className="h-11 rounded-xl px-6">
              {enviando ? "Enviando…" : "Enviar proposta"}
            </Button>
            {!completo && (
              <p className="text-sm text-muted-foreground">
                Preencha instituição, responsável, e-mail e proposta para enviar.
              </p>
            )}
          </div>
        </fieldset>
      </form>
    </section>
  );
}
