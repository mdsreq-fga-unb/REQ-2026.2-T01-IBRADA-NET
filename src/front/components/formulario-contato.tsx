"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { listarMunicipios, unidadesFederativas, type Municipio } from "@/lib/localidades";
import { site } from "@/lib/site";

const whatsapp = process.env.NEXT_PUBLIC_TRIAGEM_WHATSAPP?.trim() || site.whatsappNumber;
const whatsappDisponivel = /^[1-9][0-9]{7,14}$/.test(whatsapp);
export type Contato = { assunto: string; mensagem?: string; href?: string };

// Códigos nacionais em uso no plano de numeração brasileiro.
const ddd = "1[1-9]|2[12478]|3[1-578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9]";
const padraoCelular = String.raw`(?:\+55 *)?(?:\((?:${ddd})\)|(?:${ddd})) *9[0-9]{4}(?:[ \-])?[0-9]{4}`;
const estiloCampo = "min-w-0 rounded-md border bg-background px-2 py-1";

export function FormularioContato({
  contato,
  onNavigate,
  mensagemObrigatoria = false,
}: {
  contato: Contato;
  onNavigate?: () => void;
  mensagemObrigatoria?: boolean;
}) {
  const [uf, setUf] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [erroMunicipios, setErroMunicipios] = useState(false);
  const [tentativaMunicipios, setTentativaMunicipios] = useState(0);
  const exigeMunicipio = uf !== "" && uf !== "DF";
  const carregandoMunicipios = exigeMunicipio && !erroMunicipios && municipios.length === 0;
  const localidade = municipios.find(({ id }) => String(id) === municipio);

  useEffect(() => {
    if (!exigeMunicipio) return;
    const consulta = new AbortController();
    listarMunicipios(uf, consulta.signal)
      .then((lista) => {
        if (!consulta.signal.aborted) setMunicipios(lista);
      })
      .catch(() => {
        if (!consulta.signal.aborted) setErroMunicipios(true);
      });
    return () => consulta.abort();
  }, [uf, exigeMunicipio, tentativaMunicipios]);

  function abrirMensagem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const unidadeFederativa = unidadesFederativas.find(([sigla]) => sigla === uf);
    if (!unidadeFederativa || (exigeMunicipio && !localidade)) return;
    const [sigla, nomeUf] = unidadeFederativa;
    const ufFormatada = `${nomeUf} (${sigla})`;
    const dados = new FormData(event.currentTarget);
    const campoMensagem = event.currentTarget.elements.namedItem("mensagem") as HTMLTextAreaElement;
    const textoMensagem = campoMensagem.value.trim();
    if (mensagemObrigatoria && !textoMensagem) {
      campoMensagem.setCustomValidity("Escreva sua dúvida.");
      campoMensagem.reportValidity();
      return;
    }
    const celular = String(dados.get("celular")).replace(/\D/g, "").slice(-11);
    const numeroFormatado = `(${celular.slice(0, 2)}) ${celular.slice(2, 7)}-${celular.slice(7)}`;
    const linhas = [
      contato.mensagem,
      `Nome: ${String(dados.get("nome")).trim()}`,
      `Celular: ${numeroFormatado}`,
      localidade ? `Município/UF: ${localidade.nome}, ${ufFormatada}` : `UF: ${ufFormatada}`,
      textoMensagem,
    ];
    const mensagem = linhas.filter(Boolean).join("\r\n");
    const botao = (event.nativeEvent as SubmitEvent).submitter;
    const projeto = String(dados.get("projeto") ?? "").trim();
    const assunto = projeto ? `Projeto (${projeto})` : contato.assunto;

    if (botao?.getAttribute("value") === "whatsapp" && whatsappDisponivel) {
      window.location.assign(`https://wa.me/${whatsapp}?text=${encodeURIComponent(`${assunto}\r\n\r\n${mensagem}`)}`);
      return;
    }

    const gmail = new URL("https://mail.google.com/mail/");
    gmail.search = new URLSearchParams({
      view: "cm",
      fs: "1",
      to: site.email,
      su: assunto,
      body: mensagem,
    }).toString();
    window.open(gmail.toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={abrirMensagem} className="grid gap-3">
      {contato.href && <Link href={contato.href} onNavigate={onNavigate} className="text-sm underline">Ver informações sobre o assunto</Link>}
      <p>Assunto do contato: <strong>{contato.assunto}</strong></p>
      <p className="text-sm">O prazo de resposta varia conforme o assunto. Pedidos de serviços e projetos passam por análise inicial.</p>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid content-start gap-1 text-sm">
          Nome
          <input name="nome" autoComplete="name" required pattern={String.raw`(?=.*\p{L})[\p{L}\p{M} .’'\-]+`} title="Informe seu nome usando letras." maxLength={100} className={estiloCampo} />
        </label>
        <label className="grid content-start gap-1 text-sm">
          Celular com DDD
          <input name="celular" type="tel" autoComplete="tel" required pattern={padraoCelular} title="Use um DDD brasileiro válido e nove dígitos iniciados por 9." placeholder="(61) 99999-0000" maxLength={24} className={estiloCampo} />
        </label>
        <label className="grid content-start gap-1 text-sm">
          Estado ou Distrito Federal
          <select value={uf} required autoComplete="address-level1" className={estiloCampo} onChange={(event) => {
            setUf(event.target.value);
            setMunicipio("");
            setMunicipios([]);
            setErroMunicipios(false);
          }}>
            <option value="">Selecione a UF</option>
            {unidadesFederativas.map(([sigla, nome]) => <option key={sigla} value={sigla}>{nome} ({sigla})</option>)}
          </select>
        </label>
        {uf !== "DF" && (
          <label className="grid content-start gap-1 text-sm">
            Município
            <select value={municipio} onChange={(event) => setMunicipio(event.target.value)} required disabled={!municipios.length} autoComplete="address-level2" className={estiloCampo}>
              <option value="">{uf ? "Selecione o município" : "Selecione a UF primeiro"}</option>
              {municipios.map(({ id, nome }) => <option key={id} value={id}>{nome}</option>)}
            </select>
          </label>
        )}
      </div>
      {carregandoMunicipios && <p role="status">Carregando municípios…</p>}
      {erroMunicipios && (
        <div className="grid justify-items-start gap-2">
          <p role="alert">Não foi possível carregar os municípios.</p>
          <Button type="button" variant="outline" onClick={() => {
            setErroMunicipios(false);
            setTentativaMunicipios((anterior) => anterior + 1);
          }}>Tentar novamente</Button>
        </div>
      )}
      {contato.assunto === "Projeto" && (
        <label className="grid gap-1 text-sm">
          Nome do projeto
          <input name="projeto" required pattern={".*\\S.*"} maxLength={150} className="rounded-md border bg-background px-2 py-1" />
        </label>
      )}
      <label className="grid gap-1 text-sm">
        {mensagemObrigatoria ? "Sua dúvida" : "Mensagem (opcional)"}
        <textarea
          name="mensagem"
          required={mensagemObrigatoria}
          onChange={(event) => event.currentTarget.setCustomValidity("")}
          maxLength={1000}
          className="rounded-md border bg-background px-2 py-1"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={carregandoMunicipios || erroMunicipios}>Abrir no Gmail</Button>
        {whatsappDisponivel && <Button type="submit" value="whatsapp" variant="outline" disabled={carregandoMunicipios || erroMunicipios}>Abrir WhatsApp</Button>}
      </div>
    </form>
  );
}
