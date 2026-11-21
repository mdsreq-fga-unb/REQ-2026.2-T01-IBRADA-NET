'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Clock, FolderHeart, MapPin, SearchX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { listarOportunidades, type Oportunidade } from '@/lib/oportunidades'
import { cn } from '@/lib/utils'

const TODAS = 'Todas'
const TODOS = 'Todos'

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none',
        active ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary',
      )}
    >
      {children}
    </button>
  )
}

const unicos = (valores: Array<string | undefined>) =>
  Array.from(new Set(valores.filter((v): v is string => Boolean(v))))

export function OpportunityList() {
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([])
  const [estado, setEstado] = useState<'carregando' | 'ok' | 'erro'>('carregando')
  const [area, setArea] = useState(TODAS)
  const [formato, setFormato] = useState(TODOS)

  useEffect(() => {
    let ativo = true
    listarOportunidades()
      .then((lista) => {
        if (!ativo) return
        setOportunidades(lista.filter((o) => o.aberta))
        setEstado('ok')
      })
      .catch(() => ativo && setEstado('erro'))
    return () => {
      ativo = false
    }
  }, [])

  const areas = useMemo(() => unicos(oportunidades.map((o) => o.categoria)), [oportunidades])
  const formatos = useMemo(() => unicos(oportunidades.map((o) => o.formato)), [oportunidades])

  const filtradas = useMemo(
    () =>
      oportunidades.filter(
        (o) => (area === TODAS || o.categoria === area) && (formato === TODOS || o.formato === formato),
      ),
    [oportunidades, area, formato],
  )

  if (estado === 'carregando') {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Carregando oportunidades…
      </p>
    )
  }

  if (estado === 'erro') {
    return (
      <p role="alert" className="text-sm text-destructive">
        Não foi possível carregar as oportunidades. Tente novamente mais tarde.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {(areas.length > 0 || formatos.length > 0) && (
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
          {areas.length > 0 && (
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Área</legend>
              <div className="flex flex-wrap gap-2">
                {[TODAS, ...areas].map((a) => (
                  <FilterChip key={a} active={area === a} onClick={() => setArea(a)}>
                    {a}
                  </FilterChip>
                ))}
              </div>
            </fieldset>
          )}
          {formatos.length > 0 && (
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Formato</legend>
              <div className="flex flex-wrap gap-2">
                {[TODOS, ...formatos].map((f) => (
                  <FilterChip key={f} active={formato === f} onClick={() => setFormato(f)}>
                    {f}
                  </FilterChip>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      )}

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtradas.length} {filtradas.length === 1 ? 'oportunidade encontrada' : 'oportunidades encontradas'}
      </p>

      {filtradas.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-12 text-center">
          <SearchX aria-hidden="true" className="size-8 text-muted-foreground" />
          <p className="font-medium">
            {oportunidades.length === 0
              ? 'Nenhuma oportunidade aberta no momento.'
              : 'Nenhuma vaga com esses filtros no momento.'}
          </p>
          {oportunidades.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setArea(TODAS)
                setFormato(TODOS)
              }}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {filtradas.map((o) => (
            <li key={o.id}>
              <article className="group relative flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg">
                {(o.categoria || o.formato) && (
                  <div className="flex flex-wrap gap-2">
                    {o.categoria && <Badge variant="secondary">{o.categoria}</Badge>}
                    {o.formato && <Badge variant="outline">{o.formato}</Badge>}
                  </div>
                )}
                <h3 className="text-xl leading-snug font-semibold">
                  <Link href={`/voluntariado/${o.id}`} className="hover:text-primary focus-visible:outline-none">
                    {o.titulo}
                  </Link>
                </h3>
                <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                  {o.projeto && (
                    <li className="flex items-center gap-2">
                      <FolderHeart aria-hidden="true" className="size-4 text-primary" />
                      Projeto: <span className="font-medium text-foreground">{o.projeto}</span>
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <Clock aria-hidden="true" className="size-4 text-primary" />
                    {o.disponibilidade} · {o.duracao}
                  </li>
                  {o.local && (
                    <li className="flex items-center gap-2">
                      <MapPin aria-hidden="true" className="size-4 text-primary" />
                      {o.local}
                    </li>
                  )}
                </ul>
                {o.habilidades.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Habilidades requeridas
                    </p>
                    <ul className="flex flex-col gap-1 text-sm">
                      {o.habilidades.map((h) => (
                        <li key={h} className="flex gap-2">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-earth" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-auto pt-2">
                  <Link
                    href={`/voluntariado/${o.id}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    Ver detalhes →
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
