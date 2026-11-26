import { api } from "@/lib/api";

type Opcao = { id: string; rotulo: string };
const opcao = (id: string, rotulo: string): Opcao => ({ id, rotulo });

const tiposApoio = [
  opcao("patrocinio", "Patrocínio financeiro"),
  opcao("doacao", "Doação de materiais ou serviços"),
  opcao("institucional", "Parceria institucional"),
];

export const fluxos = {
  ecoturismo: {
    rotulo: "Quero participar de trilhas / ecoturismo comunitário",
    pergunta: "Como podemos ajudar com as trilhas?",
    opcoes: [
      opcao("disponiveis", "Ver trilhas disponíveis, datas e valores"),
      opcao("trilha", "Tirar dúvida sobre uma trilha específica"),
    ],
  },
  voluntariado: {
    rotulo: "Quero ser voluntário em um projeto",
    pergunta: "Como você quer participar?",
    opcoes: [
      opcao("conhecer", "Ver todas as oportunidades"),
      opcao("projeto", "Escolher uma oportunidade"),
      opcao("duvidas", "Tirar dúvidas sobre voluntariado"),
    ],
  },
  parcerias: {
    rotulo: "Sou empresa/instituição e quero propor parceria ou apoio",
    pergunta: "Que tipo de parceria ou apoio?",
    opcoes: [...tiposApoio, opcao("avaliando", "Ainda estou avaliando")],
  },
  apoio: {
    rotulo: "Sou agricultor familiar ou comunidade e busco assistência técnica/regularização fundiária",
    pergunta: "De que ajuda você precisa?",
    opcoes: [
      opcao("tecnico", "Assistência técnica"),
      opcao("regularizacao", "Orientação sobre regularização de terras"),
      opcao("identificar", "Preciso de ajuda para identificar"),
    ],
  },
  informacoes: {
    rotulo: "Outras dúvidas institucionais",
    pergunta: "O que você quer saber sobre o IBRADA?",
    opcoes: [
      opcao("instituto", "O que é o IBRADA?"),
      opcao("areas", "Quais são os principais projetos e áreas de atuação do IBRADA?"),
      opcao("regioes", "Como funciona o atendimento do IBRADA?"),
      opcao("contato", "Como posso entrar em contato com o IBRADA?"),
    ],
  },
};

export const situacoes = [
  opcao("cultivo", "Quero orientação para melhorar meu cultivo"),
  opcao("terra", "Quero entender como regularizar a terra que uso"),
  opcao("duvida", "Ainda estou em dúvida"),
];

export const acoesInstitucionais: Record<string, string> = {
  instituto: "Conhecer o IBRADA",
  areas: "Ver projetos",
  regioes: "Ver serviços e projetos",
  contato: "Enviar e-mail",
};

export type PerfilTriagem = keyof typeof fluxos;

export function registrarTriagem(perfil: PerfilTriagem, tipoSolicitacao: string, escolha?: string) {
  return api<{ id: string; href?: string; departamento: string; assunto?: string; mensagem?: string }>("/triagem", {
    method: "POST",
    body: { perfil, tipoSolicitacao, escolha },
  });
}
