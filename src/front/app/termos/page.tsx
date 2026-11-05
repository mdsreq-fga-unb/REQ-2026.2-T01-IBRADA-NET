import type { Metadata } from 'next'
import { site, terms } from '@/lib/site'

export const metadata: Metadata = {
  title: `Termos de Uso e Privacidade | ${site.name}`,
}

export default function Termos() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold">Termos de Uso e Política de Privacidade</h1>
      <p className="mt-2 text-sm text-gray-600">
        Versão {terms.version} · atualizado em {terms.updatedAt}
      </p>

      <nav aria-label="Seções" className="mt-6 flex flex-wrap gap-4 text-sm">
        <a href="#termos-de-uso" className="text-blue-500 hover:underline">Termos de Uso</a>
        <a href="#privacidade" className="text-blue-500 hover:underline">Política de Privacidade (LGPD)</a>
      </nav>

      <section id="termos-de-uso" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-semibold">Termos de Uso</h2>
        <div className="mt-4 flex flex-col gap-3 leading-relaxed">
          <p>
            Esta plataforma é mantida pelo {site.legalName}, CNPJ {site.cnpj}, e reúne informações e serviços
            sobre as ações do instituto, como voluntariado, ecoturismo comunitário e atendimento.
          </p>
          <p>
            <strong>Cadastro.</strong> Para usar áreas restritas, você deve informar dados verdadeiros e
            atualizados e manter sua senha em sigilo. Você é responsável pelas atividades feitas na sua conta.
          </p>
          <p>
            <strong>Uso adequado.</strong> É proibido usar a plataforma para fins ilícitos, tentar acessar
            áreas ou dados de outras pessoas, ou prejudicar o funcionamento do sistema.
          </p>
          <p>
            <strong>Conteúdo.</strong> Textos, imagens e marcas pertencem ao IBRADA ou a seus parceiros e não
            podem ser reproduzidos sem autorização.
          </p>
          <p>
            <strong>Responsabilidade.</strong> O IBRADA busca manter a plataforma disponível e correta, mas não
            garante funcionamento ininterrupto. Podemos suspender contas que violem estes termos.
          </p>
          <p>
            <strong>Alterações.</strong> Estes termos podem ser atualizados. Cada alteração gera uma nova
            versão, indicada no topo desta página.
          </p>
        </div>
      </section>

      <section id="privacidade" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-semibold">Política de Privacidade (LGPD)</h2>
        <div className="mt-4 flex flex-col gap-3 leading-relaxed">
          <p>
            Tratamos dados pessoais conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </p>
          <p>
            <strong>Dados coletados.</strong> Nome, CPF, e-mail, telefone e demais informações fornecidas no
            cadastro, além da data, hora e versão do termo que você aceitou.
          </p>
          <p>
            <strong>Finalidade e base legal.</strong> Usamos os dados para criar e gerenciar sua conta, contato
            sobre voluntariado e atividades do IBRADA e cumprimento de obrigações legais. A base legal é o seu
            consentimento, dado ao aceitar estes termos no cadastro.
          </p>
          <p>
            <strong>Compartilhamento.</strong> Não vendemos seus dados. Eles só são compartilhados quando
            necessário para cumprir obrigação legal ou com prestadores que operam a plataforma, sob dever de
            confidencialidade.
          </p>
          <p>
            <strong>Segurança.</strong> Os dados trafegam por conexão criptografada (HTTPS/TLS) e as senhas são
            armazenadas de forma protegida.
          </p>
          <p>
            <strong>Retenção.</strong> Mantemos os dados enquanto sua conta estiver ativa ou pelo prazo exigido
            por lei, e depois os eliminamos ou anonimizamos.
          </p>
          <p>
            <strong>Seus direitos.</strong> Você pode solicitar confirmação do tratamento, acesso, correção,
            anonimização, portabilidade, eliminação dos dados e revogação do consentimento (art. 18 da LGPD).
          </p>
          <p>
            <strong>Contato.</strong> Para exercer seus direitos ou tirar dúvidas, escreva para{' '}
            <a href={`mailto:${site.email}`} className="text-blue-500 hover:underline">{site.email}</a>.
          </p>
        </div>
      </section>
    </main>
  )
}
