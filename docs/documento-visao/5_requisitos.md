# 5 Engenharia de Requisitos

## 5.1 Atividades e Técnicas de ER

### **Planejamento de Requisitos:**

=== "Elicitação e Descoberta:" 
    - **Entrevistas e Reuniões:** Conversas de profundidade com os stakeholders, como a equipe do instituto para compreender os problemas, necessidades e desafios enfrentados na operação atual, como a dificuldade de comunicação com os diferentes perfis de clientes e patrocinadores.
    - **Brainstorming:** Sessões de brainstorming permitem que a equipe e os stakeholders discutam soluções criativas para melhorar a divulgação dos projetos e serviços expostos no site do IBRADA, incluindo ideias para melhorias na experiência do usuário.
    - **Análise de Domínio de Negócio:** Análise do domínio do ecoturismo, aprofundando a compreensão dos valores e diferenciais do IBRADA, como sustentabilidade e fortalecimento da autonomia de comunidades locais, garantindo que os requisitos estejam alinhados com a identidade do instituto.


=== "Análise e Consenso:"
    - **Priorização MoSCoW:** Técnica primária para classificar os requisitos em Must, Should, Could, Won't Have, garantindo um rápido consenso com o IBRADA sobre o que é essencial para compor o portal nas primeiras iterações.
    - **Planning Poker (Avaliação Técnica de Esforço):** A equipe técnica executará sessões de Planning Poker. Cada história de usuário receberá estimativas consensuais da equipe técnica baseadas em Complexidade (CX) e Esforço (ES). O resultado será a Pontuação Técnica (PT) consolidada de cada item.
    - **Matriz de Priorização 2x2 (Valor de Negócio vs. Esforço Técnico):** Plotagem gráfica para visualização das funcionalidades, permitindo identificar as candidatas ideais para cada incremento de entrega.


=== "Declaração de Requisitos:"
    - **User Stories (história de usuário):** A definição de histórias de usuários ajuda a organizar os requisitos em diferentes níveis de detalhe, gerando uma visão clara do que o usuário final espera obter de valor, proporcionando um entendimento melhor das funcionalidades a serem desenvolvidas para o site do IBRADA.
    - **Catálogo de Requisitos Estruturados e Regras de Negócio (RNs):** Mapeamento textual padronizado para os requisitos funcionais (utilizando a sintaxe padrão de verbo no infinitivo + objeto) , requisitos não funcionais concisos e as restrições e políticas que governam os processos ambientais.

### **Workshop de Design do Usuário:**

=== "Elicitação e Descoberta: "
    - **Entrevistas e Reuniões:** À medida que os usuários e o proxy de stakeholders interagem com os mockups e wireframes clicáveis, surgem novos insights e necessidades latentes que não haviam sido articulados inicialmente

=== "Representação de Requisitos:"
    - **Mockups e Protótipos de Baixa Fidelidade:** Esboços visuais e wireframes de telas para materialização de soluções estéticas e dinâmicas de interface. Essas técnicas e ferramentas permitem o uso de documentação simplificada e direta, trazendo mais eficiência ao desenvolvimento e ao processo de validação com os stakeholders.

=== "Verificação e Validação de Requisitos:"
    - **Oficinas de Validação Baseadas em Protótipos (Prototype Walkthroughs):** Sessões de navegação assistida e walkthroughs onde apresentamos o design das soluções interativas diretamente aos representantes do IBRADA para obtenção de feedback imediato.

### **Construção (Prototipagem Evolutiva):**

=== "Análise e Organização:"
    - **Análise de Tarefas:** A análise das tarefas traz detalhamento às atividades que cada membro da equipe deverá realizar, garantindo que todos entendam as dependências, que a distribuição do trabalho seja feita de forma eficiente e que o desenvolvimento possa ser acompanhado com clareza.

=== "Verificação e Validação de Requisitos:"
    - **Checklists de Qualidade de Requisitos (alinhados ao Definition of Ready - DoR):** Listas de controle técnico aplicadas internamente para inspecionar clareza, testabilidade, completude técnica, verificabilidade e ausência de acoplamento com soluções específicas de design.

=== "Organização e Atualização de Requisitos:"
    - **Backlog de Requisitos Evolutivo (Product Backlog):** Repositório unificado, dinâmico e flexível que organiza as histórias de usuário, requisitos suplementares e defeitos de forma priorizada de acordo com o valor de negócio para o instituto.
    - **Matriz de Rastreabilidade Seletiva:** Relação cruzada que conecta de forma visível as características de produto de alto nível (CPs) com as histórias de usuário e os objetivos de negócio (VNs e OEs) que as motivaram.


### **Transição (Cutover):**

=== "Verificação e Validação de Requisitos:"
    - **Testes Finais de Aceitação do Usuário (UAT):** Homologação final do sistema integrado em ambiente de homologação, garantindo que os requisitos de usabilidade, conformidade de dados e desempenho atendam plenamente aos padrões acordados antes do lançamento definitivo em produção. Os requisitos deverão estar alinhados ao Definition of Done (DoD).



## 5.2 Engenharia de Requisitos e o RAD

<table>
  <thead>
    <tr>
      <th>Fases do Processo</th>
      <th>Atividades ER</th>
      <th>Prática</th>
      <th>Técnica</th>
      <th>Resultado Esperado</th>
    </tr>
  </thead>

  <tbody>
    <!-- PLANEJAMENTO -->
    <tr>
      <td rowspan="3"><strong>Planejamento de Requisitos</strong></td>
      <td>Elicitação e Descoberta</td>
      <td>Levantamento de Requisitos</td>
      <td>Entrevistas e Reuniões, Brainstorming, Análise de Domínio de Negócio.</td>
      <td>Identificação e entendimento dos requisitos e objetivos do ciclo.</td>
    </tr>

    <tr>
      <td>Análise e Consenso</td>
      <td>Priorização de Requisitos</td>
      <td>Matriz de Priorização, Priorização MoSCoW, Planning Poker</td>
      <td>Priorização dos requisitos críticos bem definida.</td>
    </tr>

    <tr>
      <td>Declaração</td>
      <td>Registro de Requisitos</td>
      <td>User Stories, Catálogo de Requisitos Estruturados e Regras de Negócio (RNs)</td>
      <td>Registro das histórias de usuário e dos requisitos e suas relações.</td>
    </tr>

    <!-- WORKSHOP -->
    <tr>
      <td rowspan="3"><strong>Workshop de Design do Usuário</strong></td>
      <td>Elicitação e Descoberta</td>
      <td>Levantamento de Requisitos</td>
      <td>Entrevistas e Reuniões</td>
      <td>Descoberta de novos requisitos após a interação do cliente com os protótipos.</td>
    </tr>

    <tr>
      <td>Representação</td>
      <td>Criação de Protótipos Visuais</td>
      <td>Mockups e Protótipos de Baixa Fidelidade</td>
      <td>Protótipos de interface visual e fluxos de navegação interativos e dinâmicos para avaliação com o cliente.</td>
    </tr>

    <tr>
      <td>Verificação e Validação de Requisitos</td>
      <td>Verificação e Validação de Requisitos</td>
      <td>Oficinas de Validação Baseadas em Protótipos (Prototype Walkthroughs)</td>
      <td>Avaliação com o cliente para garantir que protótipos estão alinhados com as histórias de usuário e obtenção de feedback imediato. </td>
    </tr>

    <!-- PROTOTIPAGEM -->
    <tr>
      <td rowspan="3"><strong>Prototipagem Evolutiva</strong></td>
      <td>Análise e Organização</td>
      <td>Distribuição e Entendimento de Atividades</td>
      <td>Análise de Tarefas</td>
      <td>Distribuição de atividades de forma eficiente e acompanhamento claro do desenvolvimento.</td>
    </tr>

    <tr>
      <td>Verificação e Validação de Requisitos</td>
      <td>Controle de Qualidade</td>
      <td>Checklists de Qualidade de Requisitos (alinhados ao Definition of Ready - DoR)</td>
      <td>Garantia de qualidade e refinamento (clareza, testabilidade, verificabilidade, documentação, etc.) durante o desenvolvimento do design. </td>
    </tr>

    <tr>
      <td>Organização e Atualização de Requisitos</td>
      <td>Evolução e Manutenção Contínua do Backlog</td>
      <td>Backlog de Requisitos Evolutivo (Product Backlog), Matriz de Rastreabilidade Seletiva</td>
      <td>Ajustes em histórias de usuário conforme o design evolui.</td>
    </tr>

    <!-- Transição -->
    <tr>
      <td><strong>Transição (Cutover)</strong></td>
      <td>Verificação e Validação de Requisitos</td>
      <td>Testes finais de Aceitação do Usuário (UAT)</td>
      <td>Testes de Aceitação</td>
      <td>Validação final da entrega junto ao cliente por meio dos testes de aceitação.</td>
    </tr>
  </tbody>
</table>

*Tabela 5: Atividades em cada fase do RAD*