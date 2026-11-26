"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { Building2, ChevronRight, CircleHelp, HandHeart, Sprout, Trees, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormularioContato, type Contato } from "@/components/formulario-contato";
import { Button } from "@/components/ui/button";
import { listarExperiencias } from "@/lib/experiencias";
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
    : tipo === "projeto" ? "Selecione o projeto"
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

        {contato ? <FormularioContato contato={contato} mensagemObrigatoria={tipo === "projeto" || perfil === "parcerias"} onNavigate={() => dialog.current?.close()} /> : <div className="triagem-opcoes">
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
              {tipo === "projeto" && <OpcaoTriagem rotulo="Não encontrei o projeto" onClick={() => concluir(tipo, "nao-encontrei")} disabled={enviando} />}
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
