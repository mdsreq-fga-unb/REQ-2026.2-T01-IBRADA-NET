"use client";

import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, ChevronRight, CircleHelp, HandHeart, Sprout, Trees, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { listarExperiencias } from "@/lib/experiencias";
import { listarMunicipios, unidadesFederativas, type Municipio } from "@/lib/localidades";
import { site } from "@/lib/site";
import { listarOportunidades } from "@/lib/oportunidades";
import { fluxos, registrarTriagem, acoesInstitucionais, situacoes, type PerfilTriagem } from "@/lib/triagem";

const icones = {
  ecoturismo: Trees,
  voluntariado: HandHeart,
  parcerias: Building2,
  apoio: Sprout,
  informacoes: CircleHelp,
};
const perfis = Object.keys(fluxos) as PerfilTriagem[];
const whatsapp = process.env.NEXT_PUBLIC_TRIAGEM_WHATSAPP?.trim() || site.whatsappNumber;
const whatsappDisponivel = /^[1-9][0-9]{7,14}$/.test(whatsapp);
type Contato = { assunto: string; mensagem?: string; href?: string };

// Códigos nacionais em uso no plano de numeração brasileiro.
const ddd = "1[1-9]|2[12478]|3[1-578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9]";
const padraoCelular = String.raw`(?:\+55 *)?(?:\((?:${ddd})\)|(?:${ddd})) *9[0-9]{4}(?:[ \-])?[0-9]{4}`;
const estiloCampo = "min-w-0 rounded-md border bg-background px-2 py-1";

function FormularioContato({ contato, onNavigate }: { contato: Contato; onNavigate: () => void }) {
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
    const celular = String(dados.get("celular")).replace(/\D/g, "").slice(-11);
    const numeroFormatado = `(${celular.slice(0, 2)}) ${celular.slice(2, 7)}-${celular.slice(7)}`;
    const linhas = [
      contato.mensagem,
      `Nome: ${String(dados.get("nome")).trim()}`,
      `Celular: ${numeroFormatado}`,
      localidade ? `Município/UF: ${localidade.nome}, ${ufFormatada}` : `UF: ${ufFormatada}`,
      String(dados.get("mensagem")).trim(),
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
        Mensagem (opcional)
        <textarea name="mensagem" maxLength={1000} className="rounded-md border bg-background px-2 py-1" />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={carregandoMunicipios || erroMunicipios}>Abrir no Gmail</Button>
        {whatsappDisponivel && <Button type="submit" value="whatsapp" variant="outline" disabled={carregandoMunicipios || erroMunicipios}>Abrir WhatsApp</Button>}
      </div>
    </form>
  );
}

async function carregarOpcoes(tipo: string) {
  if (tipo === "trilha") {
    const trilhas = await listarExperiencias();
    return trilhas.filter(({ isAvailable }) => isAvailable).map(({ slug, title }) => ({ id: slug, rotulo: title }));
  }

  const oportunidades = await listarOportunidades();
  return oportunidades.filter(({ aberta }) => aberta).map(({ id, titulo }) => ({ id, rotulo: titulo }));
}

function OpcaoTriagem({ rotulo, onClick, Icon, disabled }: {
  rotulo: string;
  onClick: () => void;
  Icon?: typeof Trees;
  disabled?: boolean;
}) {
  return (
    <button type="button" className="triagem-opcao" onClick={onClick} disabled={disabled}>
      {Icon && <span className="triagem-icone"><Icon size={18} aria-hidden /></span>}
      <span>{rotulo}</span>
      <ChevronRight size={15} aria-hidden className="triagem-seta" />
    </button>
  );
}

export function TriagemModal({ dialog }: { dialog: RefObject<HTMLDialogElement | null> }) {
  const titulo = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilTriagem>();
  const [tipo, setTipo] = useState("");
  const [lista, setLista] = useState<{ id: string; rotulo: string }[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");
  const [erroLista, setErroLista] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const [contato, setContato] = useState<Contato>();
  const etapa = contato || tipo ? 3 : perfil ? 2 : 1;

  useEffect(() => {
    if (dialog.current?.open) titulo.current?.focus();
  }, [dialog, etapa, contato]);

  useEffect(() => {
    if (tipo !== "trilha" && tipo !== "projeto") return;
    let ativo = true;
    carregarOpcoes(tipo)
      .then((opcoes) => {
        if (ativo) setLista(opcoes);
      })
      .catch(() => {
        if (ativo) setErroLista("Não foi possível carregar as opções. Tente novamente.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => { ativo = false; };
  }, [tipo, tentativa]);

  function selecionarTipo(id: string) {
    if (perfil !== "informacoes" && !["trilha", "projeto", "identificar"].includes(id)) {
      void concluir(id);
      return;
    }
    setLista([]);
    setErroLista("");
    setErroEnvio("");
    setCarregando(id === "trilha" || id === "projeto");
    setTipo(id);
  }

  function voltar() {
    setErroEnvio("");
    if (contato) setContato(undefined);
    else if (tipo) setTipo("");
    else setPerfil(undefined);
  }

  function fechar() {
    setContato(undefined);
    setTipo("");
    setPerfil(undefined);
    setErroEnvio("");
  }

  async function concluir(solicitacao: string, escolha?: string) {
    if (!perfil || enviando) return;
    setEnviando(true);
    setErroEnvio("");
    try {
      const { href, assunto, mensagem } = await registrarTriagem(perfil, solicitacao, escolha);
      if (assunto) {
        setContato({ href, assunto, mensagem });
      } else if (href) {
        dialog.current?.close();
        router.push(href);
      }
    } catch (erro) {
      setErroEnvio(erro instanceof Error ? erro.message : "Não foi possível concluir a triagem. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  const acaoInstitucional = perfil === "informacoes" ? acoesInstitucionais[tipo] : undefined;
  const dinamico = tipo === "trilha" || tipo === "projeto";
  const perguntaFinal = contato ? "Dados para contato" : tipo === "trilha" ? "Selecione a trilha"
    : tipo === "projeto" ? "Selecione a oportunidade"
    : tipo === "identificar" ? "Qual situação se parece mais com a sua?"
    : perfil && fluxos[perfil].opcoes.find(({ id }) => id === tipo)?.rotulo;

  return (
    <dialog
      ref={dialog}
      id="triagem-modal"
      className="triagem-modal"
      aria-labelledby="triagem-titulo"
      onClose={fechar}
      onClick={(event) => {
        if (event.target === event.currentTarget && !enviando) event.currentTarget.close();
      }}
      onCancel={(event) => { if (enviando) event.preventDefault(); }}
    >
      <header className="triagem-cabecalho">
        <span className="triagem-logo">
          <Image src="/IBRADA_logo_Sfundo.png" alt="IBRADA" width={32} height={32} />
        </span>
        <div>
          <h2 id="triagem-titulo">Atendimento IBRADA</h2>
          <p>Como podemos ajudar você hoje?</p>
        </div>
        <button type="button" className="triagem-fechar" aria-label="Fechar atendimento" disabled={enviando} onClick={() => dialog.current?.close()}>
          <X size={15} aria-hidden />
        </button>
      </header>

      <div className="triagem-conteudo">
        <div className="triagem-progresso">
          {[1, 2, 3].map((passo) => <span key={passo} data-ativo={passo <= etapa} aria-hidden />)}
          <small>Etapa {etapa} de 3</small>
        </div>

        <h3 ref={titulo} tabIndex={-1}>
          {etapa === 1 ? "Quem é você?" : etapa === 2 && perfil ? fluxos[perfil].pergunta : perguntaFinal}
        </h3>

        {contato ? <FormularioContato contato={contato} onNavigate={() => dialog.current?.close()} /> : <div className="triagem-opcoes">
          {etapa === 1 && perfis.map((id) => (
            <div key={id}><OpcaoTriagem rotulo={fluxos[id].rotulo} onClick={() => setPerfil(id)} Icon={icones[id]} /></div>
          ))}
          {etapa === 2 && perfil && fluxos[perfil].opcoes.map(({ id, rotulo }) => (
            <div key={id}><OpcaoTriagem rotulo={rotulo} onClick={() => selecionarTipo(id)} disabled={enviando} /></div>
          ))}
          {etapa === 3 && tipo === "identificar" && situacoes.map(({ id, rotulo }) => (
            <div key={id}><OpcaoTriagem rotulo={rotulo} onClick={() => concluir(tipo, id)} disabled={enviando} /></div>
          ))}
          {etapa === 3 && dinamico && (
            <>
              {carregando && <p role="status">Carregando opções…</p>}
              {erroLista && (
                <div>
                  <p role="alert">{erroLista}</p>
                  <Button variant="outline" onClick={() => {
                    setErroLista("");
                    setCarregando(true);
                    setTentativa(tentativa + 1);
                  }}>Tentar novamente</Button>
                </div>
              )}
              {!carregando && !erroLista && lista.length === 0 && <p>Nenhuma opção disponível no momento.</p>}
              {lista.map(({ id, rotulo }) => (
                <div key={id}><OpcaoTriagem rotulo={rotulo} onClick={() => concluir(tipo, id)} disabled={enviando} /></div>
              ))}
              {tipo === "projeto" && <OpcaoTriagem rotulo="Não encontrei a oportunidade" onClick={() => concluir(tipo, "nao-encontrei")} disabled={enviando} />}
              {tipo === "trilha" && !carregando && !erroLista && lista.length === 0 &&
                <OpcaoTriagem rotulo="Ver catálogo de ecoturismo" onClick={() => selecionarTipo("disponiveis")} disabled={enviando} />}
            </>
          )}
          {tipo === "regioes" && <p>O atendimento é organizado por tipo de serviço ou projeto.</p>}
          {etapa === 3 && acaoInstitucional && (
            <OpcaoTriagem rotulo={acaoInstitucional} onClick={() => concluir(tipo)} disabled={enviando} />
          )}
        </div>}

        {enviando && <p role="status" className="mt-3">Concluindo triagem…</p>}
        {erroEnvio && <p role="alert" className="mt-3 text-destructive">{erroEnvio}</p>}
        {etapa > 1 && <Button className="mt-3" variant="ghost" onClick={voltar} disabled={enviando}>Voltar</Button>}
      </div>
    </dialog>
  );
}
