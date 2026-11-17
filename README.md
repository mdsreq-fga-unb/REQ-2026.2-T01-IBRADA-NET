# REQ-2026.2-T01-IBRADA-NET


<div align="center">
  <img src="./assets/Captura de tela 2026-09-04 175445.png" alt="Logo Ibrada - Net" width="250">
</div>

##  Sobre o Projeto

O **Ibrada - Net** é um projeto desenvolvido na disciplina de **Engenharia de Requisitos**, com foco na aplicação de técnicas e práticas para levantamento, análise, especificação e validação de requisitos de software.

Este repositório reúne os artefatos produzidos ao longo do desenvolvimento do projeto, incluindo documentos de visão, cronograma, atas de reuniões e demais referências, além do código do sistema (`src/back` e `src/front`).

##  Documentação

A documentação completa do projeto está disponível no **GitHub Pages**:

> 🔗 **[Acessar a documentação do projeto](https://mdsreq-fga-unb.github.io/REQ-2026.2-T01-IBRADA-NET/index.html)**


## 🔗 Links

*  [Documentação do Projeto](https://mdsreq-fga-unb.github.io/REQ-2026.2-T01-IBRADA-NET/index.html)
*  [Documento de Visão](https://docs.google.com/document/d/1JuMdYhAhbbBK1ZZBhmm_-v7o6d5Aza8ZaxQL47o1ebc/edit?usp=sharing)
*  [Gravações das Reuniões](https://youtube.com/playlist?list=PLOmJTo1E5Wyw&si=9lyK_hsuy6EZTuQn)
*  [Teams da Equipe](https://teams.microsoft.com/l/team/19%3A0dOSnB3AYm3zzQCzEALbv6DH-oHT9kyTA-W4dfta8WQ1%40thread.tacv2/conversations?groupId=36b1501e-47b5-4aa9-ae12-2e90ad821653&tenantId=ec359ba1-630b-4d2b-b833-c8e6d48f8059)
* [Entrega Vídeo Unidade 1](https://youtu.be/Tbwe6YTXCpU)
* [Entrega Vídeo Unidade 2](https://youtu.be/wUdjf5uPtsc)
* [Entrega Vídeo Unidade 3](https://youtu.be/5Fm4chCAIHY)

##  Equipe

| Nome                                                    | Matrícula |
| ------------------------------------------------------- | --------: |
| [Arthur Scartezini](https://github.com/Ascartezin)      | 241025176 |
| [Cauã Mendes](https://github.com/cauamc2006-sketch)     | 242032237 |
| [Filipe Brito](https://github.com/filipeBG-07)          | 241031530 |
| [Gabriel Guedes](https://github.com/gabriel-ggf)        | 232014656 |
| [Igor Lima](https://github.com/igorlym)                 | 241025953 |
| [Vinícius dos Santos](https://github.com/Vplayer-coder) | 211043772 |
| [Zayra Moraes](https://github.com/Zayra-Moraes)         | 242015989 |


##  Status

**Entrega da unidade 1 realizada**

 - Projeto proposto e aprovado
 - Visão de Produto e Projeto entregue.
 - Site do projeto (GitHub Pages)
 - [Vídeo de apresentação](https://youtu.be/Tbwe6YTXCpU)

**Entrega da unidade 2 realizada**

- Elicitação e Descoberta de requisitos
- Analise e consenso de requisitos
- Declaração de requisitos
- Definição do backlog do produto
- Definição do MVP
- DoR e DoD
- [Vídeo de apresentação](https://youtu.be/wUdjf5uPtsc)

**Entrega da unidade 3 realizada**

- Representação de requisitos (protótipos, diagramas e banco de dados)
- Verificação e validação de requisitos
- Organização e atualização de requisitos
- Cronograma atualizado
- Implementação do sistema
- [Vídeo de apresentação](https://youtu.be/5Fm4chCAIHY)


## Como rodar o projeto

O sistema é composto por banco MySQL, back-end (NestJS + Prisma) e front-end (Next.js), todos executados com Docker Compose.

**Pré-requisitos:** [Docker](https://docs.docker.com/get-docker/) com Docker Compose. O `make` é opcional (os comandos abaixo funcionam sem ele).

**1. Configurar as variáveis de ambiente**

```bash
cp .env.example .env
```

No `.env`, preencha:

- `JWT_SECRET` (obrigatório, mínimo de 32 caracteres; o back-end não sobe sem ele). Para gerar: `openssl rand -hex 32`.
- `GESTOR_EMAIL`, `GESTOR_PASSWORD` e `GESTOR_NAME` (opcional): criam o gestor inicial na subida do back-end. A senha precisa ter 8 ou mais caracteres, com 1 maiúscula, 1 número e 1 caractere especial. Sem essas variáveis, não há usuário gestor e as telas de `/gestor` ficam inacessíveis.

**2. Subir os serviços e preparar o banco**

```bash
docker compose up -d --build
docker compose exec back npx prisma migrate deploy
docker compose exec back npx prisma generate
```

Com `make`, os três comandos são feitos por `make setup`.

**3. (Opcional) Popular o banco com dados de demonstração**

```bash
docker compose exec back npx prisma db seed
```

O seed é idempotente e cria categorias, projetos, oportunidades de voluntariado e usuários de teste (somente fora de produção). Todos usam a senha `Teste@123`:

| Perfil | E-mail |
| ------ | ------ |
| Cliente | `cliente@exemplo.com` |
| Voluntária | `voluntario1@exemplo.com` |
| Voluntário em formação | `voluntario2@exemplo.com` |

**4. Acessar**

| Serviço | Endereço |
| ------- | -------- |
| Front-end | http://localhost:3000 |
| API (back-end) | http://localhost:3001 |
| MySQL | `localhost:3306` (banco `ibradanet`) |

**Comandos úteis**

```bash
docker compose logs -f              # logs de todos os serviços
docker compose exec back npm test   # testes do back-end
docker compose down                 # para os contêineres
```

Depois de alterar o `schema.prisma`, crie a migration com `docker compose exec back npx prisma migrate dev`.

**Documentação local (MkDocs)**

```bash
pip install -r requirements.txt
mkdocs serve
```

O site abre em http://127.0.0.1:8000.

**Última atualização:** 17/11/2026
