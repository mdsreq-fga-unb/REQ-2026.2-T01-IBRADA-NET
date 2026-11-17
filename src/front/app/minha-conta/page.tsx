"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  HeartHandshake,
  Loader2,
  LogOut,
  UserRound,
} from "lucide-react";
import {
  createPerfilVoluntario,
  getMe,
  setFlashMessage,
  updateUser,
  type Role,
  type UserProfile,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { UFS, type NivelEducacao, type StatusEducacao } from "@/lib/brasil";
import { VoluntarioFields, type VoluntarioFormValues } from "@/components/voluntario-fields";

const ROLE_LABELS: Record<Role, string> = {
  CLIENTE: "Cliente IBRADA",
  VOLUNTARIO: "Voluntário IBRADA",
  GESTOR: "Gestor IBRADA",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "IB";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatMemberSince(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
  return `Membro desde ${formatted}`;
}

function toDateInputValue(isoDate: string | null): string {
  if (!isoDate) return "";
  return isoDate.slice(0, 10);
}

type PersonalFormState = {
  name: string;
  phone: string;
  dataNascimento: string;
  cidade: string;
  estado: string;
};

const EMPTY_VOLUNTARIO: VoluntarioFormValues = {
  categoriaIds: [],
  educacaoNivel: "",
  educacaoCompletude: "",
  bio: "",
  outros: "",
};

function buildPersonalState(profile: UserProfile): PersonalFormState {
  return {
    name: profile.name ?? "",
    phone: profile.phone ?? "",
    dataNascimento: toDateInputValue(profile.dataNascimento),
    cidade: profile.cidade ?? "",
    estado: profile.estado ?? "",
  };
}

function buildVoluntarioState(profile: UserProfile): VoluntarioFormValues {
  const pv = profile.perfilVoluntario;
  if (!pv) return EMPTY_VOLUNTARIO;
  return {
    categoriaIds: pv.interesses.map((item) => item.categoria.id),
    educacaoNivel: pv.educacaoNivel ?? "",
    educacaoCompletude: pv.educacaoCompletude ?? "",
    bio: pv.bio ?? "",
    outros: pv.outros ?? "",
  };
}

export default function MinhaConta() {
  const { logout, updateSession } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [pageError, setPageError] = useState("");

  // Estado do formulário "Dados pessoais" (US05)
  const [personalForm, setPersonalForm] = useState<PersonalFormState>({
    name: "",
    phone: "",
    dataNascimento: "",
    cidade: "",
    estado: "",
  });
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [personalError, setPersonalError] = useState("");
  const [personalSuccess, setPersonalSuccess] = useState("");

  // Estado do formulário "Seu perfil voluntário" (US15 / US05)
  const [voluntarioForm, setVoluntarioForm] = useState<VoluntarioFormValues>(EMPTY_VOLUNTARIO);
  const [savingVoluntario, setSavingVoluntario] = useState(false);
  const [voluntarioError, setVoluntarioError] = useState("");
  const [voluntarioSuccess, setVoluntarioSuccess] = useState("");

  const loadProfile = useCallback(async () => {
    setLoadingPage(true);
    setPageError("");
    try {
      const data = await getMe();
      setProfile(data);
      setPersonalForm(buildPersonalState(data));
      setVoluntarioForm(buildVoluntarioState(data));
    } catch (err) {
      setPageError(err instanceof Error ? err.message : "Não foi possível carregar seus dados.");
    } finally {
      setLoadingPage(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSavePersonal(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;

    setPersonalError("");
    setPersonalSuccess("");

    const trimmedName = personalForm.name.trim();
    const trimmedCidade = personalForm.cidade.trim();
    const trimmedEstado = personalForm.estado.trim().toUpperCase();

    if (!trimmedName) {
      setPersonalError("Informe seu nome completo.");
      return;
    }
    if (!personalForm.dataNascimento) {
      setPersonalError("Informe sua data de nascimento.");
      return;
    }
    if (new Date(personalForm.dataNascimento).getTime() > Date.now()) {
      setPersonalError("A data de nascimento não pode estar no futuro.");
      return;
    }
    if (!trimmedCidade) {
      setPersonalError("Informe sua cidade.");
      return;
    }
    if (!trimmedEstado) {
      setPersonalError("Selecione seu estado (UF).");
      return;
    }

    setSavingPersonal(true);
    try {
      const updated = await updateUser(profile.id, {
        name: trimmedName,
        phone: personalForm.phone.trim() || undefined,
        dataNascimento: personalForm.dataNascimento,
        cidade: trimmedCidade,
        estado: trimmedEstado,
      });

      const nextProfile: UserProfile = {
        ...profile,
        name: updated.name,
        phone: updated.phone,
        dataNascimento: updated.dataNascimento,
        cidade: updated.cidade,
        estado: updated.estado,
      };
      setProfile(nextProfile);
      setPersonalForm(buildPersonalState(nextProfile));
      updateSession({ id: updated.id, name: updated.name, role: updated.role });
      setPersonalSuccess("Dados pessoais atualizados com sucesso.");
    } catch (err) {
      setPersonalError(
        err instanceof Error ? err.message : "Não foi possível salvar os dados pessoais.",
      );
    } finally {
      setSavingPersonal(false);
    }
  }

  function handleCancelPersonal() {
    if (!profile) return;
    setPersonalForm(buildPersonalState(profile));
    setPersonalError("");
    setPersonalSuccess("");
  }

  async function handleSaveVoluntario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;

    setVoluntarioError("");
    setVoluntarioSuccess("");
    setSavingVoluntario(true);

    const payload = {
      bio: voluntarioForm.bio.trim() || undefined,
      outros: voluntarioForm.outros.trim() || undefined,
      educacaoNivel: (voluntarioForm.educacaoNivel || undefined) as NivelEducacao | undefined,
      educacaoCompletude: (voluntarioForm.educacaoCompletude || undefined) as
        | StatusEducacao
        | undefined,
      categoriaIds: voluntarioForm.categoriaIds,
    };

    try {
      if (!profile.perfilVoluntario) {
        // Criação pela primeira vez (US15): cria perfil, atualiza role/token e vai para a home.
        const created = await createPerfilVoluntario(payload);
        updateSession(created.user, created.access_token);
        setFlashMessage(
          "Perfil de voluntário criado com sucesso! Agora você já faz parte da rede de voluntários do IBRADA.",
        );
        router.push("/");
        return;
      }

      // Edição de perfil voluntário já existente (US05)
      await updateUser(profile.id, payload);
      await loadProfile();
      setVoluntarioSuccess("Perfil de voluntário atualizado com sucesso.");
    } catch (err) {
      setVoluntarioError(
        err instanceof Error ? err.message : "Não foi possível salvar o perfil de voluntário.",
      );
    } finally {
      setSavingVoluntario(false);
    }
  }

  async function handleLogout() {
    if (!window.confirm("Deseja realmente sair da sua conta?")) return;
    await logout();
    router.push("/");
  }

  const firstName = profile?.name.trim().split(/\s+/)[0] ?? "Visitante";

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Cabeçalho / Hero bege fiel ao protótipo */}
      <section className="border-b border-border/70 bg-[#F8EFE2] px-4 py-10 sm:px-6 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold tracking-widest text-earth uppercase">Minha conta</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Olá, {firstName}. Este é o seu espaço.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Seus dados, voluntariado e experiências em um só lugar. Uma conta única para todas as suas formas de participar.
          </p>
        </div>
      </section>

      {/* Conteúdo principal */}
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        {loadingPage && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-muted-foreground">
            <Loader2 className="size-7 animate-spin text-primary" />
            <p className="mt-3 text-sm">Carregando informações da sua conta...</p>
          </div>
        )}

        {!loadingPage && pageError && (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-destructive"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0" />
              <div>
                <h2 className="font-semibold">Não foi possível carregar sua conta</h2>
                <p className="mt-1 text-sm">{pageError}</p>
                <button
                  type="button"
                  onClick={loadProfile}
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {!loadingPage && !pageError && profile && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
            {/* Barra lateral (empilhada no mobile, fixa no desktop) */}
            <aside className="rounded-2xl border border-border bg-[#F8EFE2] p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-3.5 lg:flex-col lg:items-start">
                <div
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground"
                >
                  {getInitials(profile.name)}
                </div>
                <div>
                  <p className="font-serif text-lg font-bold leading-snug text-foreground">
                    {profile.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatMemberSince(profile.createdAt)}
                  </p>
                </div>
              </div>

              <nav aria-label="Navegação da conta" className="mt-6 border-t border-border/80 pt-4">
                <ul className="space-y-1.5 text-sm">
                  <li>
                    <a
                      href="#dados-pessoais"
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 font-medium text-foreground transition-colors hover:bg-background/70"
                    >
                      <UserRound className="size-4 text-primary" />
                      <span>Dados pessoais</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#perfil-voluntario"
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 font-medium text-foreground transition-colors hover:bg-background/70"
                    >
                      <HeartHandshake className="size-4 text-primary" />
                      <span>Perfil voluntário</span>
                    </a>
                  </li>
                </ul>

                <div className="mt-4 border-t border-border/80 pt-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    <span>Sair da conta</span>
                  </button>
                </div>
              </nav>
            </aside>

            {/* Coluna principal de cards */}
            <div className="space-y-6">
              {/* CARD 1: Dados pessoais (US05) */}
              <section
                id="dados-pessoais"
                className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">Dados pessoais</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Mantenha seus dados atualizados para receber informações das atividades e viagens.
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {ROLE_LABELS[profile.role]}
                  </span>
                </div>

                <form onSubmit={handleSavePersonal} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-foreground sm:col-span-2">
                      Nome completo *
                      <input
                        type="text"
                        required
                        value={personalForm.name}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </label>

                    <label className="block text-sm font-medium text-foreground">
                      E-mail
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="mt-1.5 min-h-11 w-full cursor-not-allowed rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
                      />
                    </label>

                    <label className="block text-sm font-medium text-foreground">
                      Telefone / WhatsApp
                      <input
                        type="tel"
                        value={personalForm.phone}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        placeholder="(61) 99999-9999"
                        className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </label>

                    <label className="block text-sm font-medium text-foreground">
                      Data de nascimento *
                      <input
                        type="date"
                        required
                        value={personalForm.dataNascimento}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, dataNascimento: e.target.value }))
                        }
                        className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_110px]">
                      <label className="block text-sm font-medium text-foreground">
                        Cidade *
                        <input
                          type="text"
                          required
                          value={personalForm.cidade}
                          onChange={(e) =>
                            setPersonalForm((prev) => ({ ...prev, cidade: e.target.value }))
                          }
                          placeholder="Ex.: Brasília"
                          className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                      </label>

                      <label className="block text-sm font-medium text-foreground">
                        UF *
                        <select
                          required
                          value={personalForm.estado}
                          onChange={(e) =>
                            setPersonalForm((prev) => ({ ...prev, estado: e.target.value }))
                          }
                          className="mt-1.5 min-h-11 w-full rounded-lg border border-input bg-card px-2.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
                        >
                          <option value="">UF</option>
                          {UFS.map((uf) => (
                            <option key={uf.sigla} value={uf.sigla}>
                              {uf.sigla}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  {personalError && (
                    <div
                      role="alert"
                      className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{personalError}</span>
                    </div>
                  )}

                  {personalSuccess && (
                    <div
                      role="status"
                      className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-700" />
                      <span>{personalSuccess}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={savingPersonal}
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 cursor-pointer"
                    >
                      {savingPersonal ? "Salvando..." : "Salvar alterações"}
                    </button>
                    <button
                      type="button"
                      disabled={savingPersonal}
                      onClick={handleCancelPersonal}
                      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-input bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60 cursor-pointer"
                    >
                      Cancelar edição
                    </button>
                  </div>
                </form>
              </section>

              {/* CARD 2: Seu perfil voluntário (US15 / US05) */}
              <section
                id="perfil-voluntario"
                className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">
                      Seu perfil voluntário
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {profile.perfilVoluntario
                        ? "Atualize suas áreas de interesse, escolaridade e disponibilidade para os projetos do IBRADA."
                        : "Apresente suas habilidades, formação e interesses para participar como voluntário(a)."}
                    </p>
                  </div>

                  {profile.perfilVoluntario ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
                      Perfil ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      Ainda não cadastrado
                    </span>
                  )}
                </div>

                {!profile.perfilVoluntario && (
                  <div className="mt-5 rounded-xl border border-border/80 bg-[#F8EFE2] p-4">
                    <p className="text-sm font-semibold text-foreground">
                      Complete sua forma de contribuir
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      Preencha seus interesses e disponibilidade abaixo para ativar seu perfil de voluntário na mesma conta.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSaveVoluntario} className="mt-6 space-y-5">
                  <VoluntarioFields
                    values={voluntarioForm}
                    onChange={setVoluntarioForm}
                    disabled={savingVoluntario}
                  />

                  {voluntarioError && (
                    <div
                      role="alert"
                      className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{voluntarioError}</span>
                    </div>
                  )}

                  {voluntarioSuccess && (
                    <div
                      role="status"
                      className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-700" />
                      <span>{voluntarioSuccess}</span>
                    </div>
                  )}

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={savingVoluntario}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 sm:w-auto cursor-pointer"
                    >
                      {savingVoluntario
                        ? "Salvando..."
                        : profile.perfilVoluntario
                          ? "Salvar perfil voluntário"
                          : "Completar perfil voluntário"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
