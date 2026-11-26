"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  CreditCard,
  FileCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  User,
  Compass,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Reserva, calcularSegundosRestantes, listarMinhasReservas } from "@/lib/reservas";

export default function MinhaConta() {
  const { user, ready } = useAuth();

  const [abaAtiva, setAbaAtiva] = useState<"reservas" | "dados">("reservas");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<"TODAS" | "PENDING" | "CONFIRMED" | "CANCELED">(
    "TODAS"
  );
  const [loadingReservas, setLoadingReservas] = useState(true);

  useEffect(() => {
    if (user?.id) {
      listarMinhasReservas(user.id).then((lista) => {
        setReservas(lista);
        setLoadingReservas(false);
      });
    } else if (ready && !user) {
      setLoadingReservas(false);
    }
  }, [user?.id, ready, user]);

  const formatarData = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const reservasFiltradas = reservas.filter((res) => {
    if (filtroStatus === "TODAS") return true;
    return res.status === filtroStatus;
  });

  if (!ready) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground">
        Carregando informações da conta...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-serif text-foreground">Acesso Restrito</h2>
        <p className="mt-2 text-muted-foreground">
          Entre na sua conta para visualizar suas reservas e dados cadastrais.
        </p>
        <Link
          href="/login?redirect=/minha-conta"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          Entrar na Conta
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Cabeçalho do Perfil */}
      <div className="mb-8 border-b pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {user.role ?? "CLIENTE"}
            </span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-foreground mt-1">
            Olá, {user.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas reservas de ecoturismo e acompanhe o status de pagamentos.
          </p>
        </div>

        <Link
          href="/ecoturismo"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
        >
          <Compass className="size-4" />
          Explorar Experiências
        </Link>
      </div>

      {/* Navegação por Abas */}
      <div className="flex border-b mb-8 gap-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setAbaAtiva("reservas")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            abaAtiva === "reservas"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="size-4" />
          <span>Minhas Reservas ({reservas.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva("dados")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            abaAtiva === "dados"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="size-4" />
          <span>Meus Dados Cadastrais</span>
        </button>
      </div>

      {/* ABA: MINHAS RESERVAS (Requisito 6) */}
      {abaAtiva === "reservas" && (
        <div className="space-y-6">
          {/* Filtros de Status */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltroStatus("TODAS")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filtroStatus === "TODAS"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              Todas ({reservas.length})
            </button>

            <button
              type="button"
              onClick={() => setFiltroStatus("PENDING")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filtroStatus === "PENDING"
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              Pendentes ({reservas.filter((r) => r.status === "PENDING").length})
            </button>

            <button
              type="button"
              onClick={() => setFiltroStatus("CONFIRMED")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filtroStatus === "CONFIRMED"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              Confirmadas ({reservas.filter((r) => r.status === "CONFIRMED").length})
            </button>

            <button
              type="button"
              onClick={() => setFiltroStatus("CANCELED")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filtroStatus === "CANCELED"
                  ? "bg-gray-700 text-white shadow-2xs"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              Expiradas / Canceladas ({reservas.filter((r) => r.status === "CANCELED").length})
            </button>
          </div>

          {loadingReservas ? (
            <div className="py-16 text-center text-muted-foreground">
              Buscando suas reservas...
            </div>
          ) : reservasFiltradas.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <Calendar className="mx-auto size-12 text-muted-foreground mb-3 opacity-50" />
              <h3 className="text-lg font-bold text-foreground">Nenhuma reserva encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                {filtroStatus === "TODAS"
                  ? "Você ainda não realizou nenhuma reserva de ecoturismo no IBRADA. Conheça nossos pacotes sustentáveis no Cerrado!"
                  : `Nenhuma reserva com status "${filtroStatus}" no momento.`}
              </p>
              <Link
                href="/ecoturismo"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
              >
                <Sparkles className="size-4" />
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div className="grid gap-5">
              {reservasFiltradas.map((res) => {
                const segundos = calcularSegundosRestantes(res);
                const minutosRestantes = Math.floor(segundos / 60);

                return (
                  <div
                    key={res.id}
                    className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Badges de Status (Requisito 6) */}
                        {res.status === "CONFIRMED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                            <CheckCircle2 className="size-3.5" />
                            Confirmada & Paga
                          </span>
                        ) : res.status === "PENDING" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                            <Clock className="size-3.5 text-amber-700 animate-spin" />
                            Pendente ({minutosRestantes} min restantes)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                            <XCircle className="size-3.5" />
                            Expirada / Cancelada
                          </span>
                        )}

                        <span className="text-xs text-muted-foreground font-mono">
                          #{res.id}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-foreground font-serif">
                        {res.experienceTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3.5 text-primary" />
                          <span>{formatarData(res.experienceStartsAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="size-3.5 text-primary" />
                          <span>{res.seats} pessoa(s)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="size-3.5 text-primary" />
                          <span>
                            Total:{" "}
                            <strong className="text-foreground">
                              R$ {res.totalAmount.toFixed(2).replace(".", ",")}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação por Status (Requisito 6: Retomar Reserva Pendente) */}
                    <div className="flex flex-wrap items-center gap-2 md:self-center shrink-0">
                      {res.status === "PENDING" && (
                        <Link
                          href={`/reservas/${res.id}/pagamento`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
                        >
                          <CreditCard className="size-4" />
                          Retomar Pagamento
                        </Link>
                      )}

                      {res.status === "CONFIRMED" && (
                        <Link
                          href={`/reservas/${res.id}/comprovante`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-primary text-primary px-4 py-2.5 text-xs font-bold hover:bg-primary/5 transition-colors"
                        >
                          <FileCheck className="size-4" />
                          Ver Comprovante
                        </Link>
                      )}

                      {res.status === "CANCELED" && (
                        <Link
                          href={`/ecoturismo/${res.experienceSlug}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary"
                        >
                          <RefreshCw className="size-3.5" />
                          Fazer Nova Reserva
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA: MEUS DADOS */}
      {abaAtiva === "dados" && (
        <div className="rounded-2xl border bg-card p-6 shadow-xs max-w-xl space-y-4">
          <h2 className="text-xl font-bold font-serif text-foreground">Dados Pessoais</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Nome Completo:</span>
              <span className="font-medium text-foreground">{user.name}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Papel no Sistema:</span>
              <span className="font-medium text-foreground">{user.role}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
