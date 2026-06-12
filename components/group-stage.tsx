"use client"

import { ArrowRight, Trophy } from "lucide-react"
import { GroupCard } from "@/components/group-card"
import { Flag } from "@/components/flag"
import { Button } from "@/components/ui/button"
import {
  GROUP_IDS,
  TEAMS,
  GROUP_COLORS,
  QUALIFIED_THIRD_GROUPS,
  type GroupOrder,
} from "@/lib/tournament"

export function GroupStage({
  order,
  onReorder,
  onGenerate,
}: {
  order: GroupOrder
  onReorder: (groupId: string, newOrder: string[]) => void
  onGenerate: () => void
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-32 pt-6 sm:pt-10">
      <header className="mb-6 text-center sm:mb-10">
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          <Trophy className="h-3.5 w-3.5" /> Fase de grupos
        </p>
        <h1 className="text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Quiniela Mundial 2026
        </h1>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          Ordena cada grupo del 1º al 4º arrastrando o con las flechas. Los dos
          primeros y los 8 mejores terceros avanzan.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GROUP_IDS.map((groupId) => (
          <GroupCard
            key={groupId}
            groupId={groupId}
            teamIds={order[groupId]}
            onReorder={onReorder}
          />
        ))}
      </div>

      {/* Best thirds */}
      <section className="mt-8 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm">
        <h2 className="mb-1 text-base font-bold text-foreground">
          Mejores terceros clasificados
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Para simplificar, clasifican los terceros de los grupos A a H.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {QUALIFIED_THIRD_GROUPS.map((groupId) => {
            const thirdId = order[groupId]?.[2]
            const team = thirdId ? TEAMS[thirdId] : null
            const color = GROUP_COLORS[groupId]
            return (
              <div
                key={groupId}
                className="flex items-center gap-2 rounded-xl border bg-secondary/50 px-2.5 py-2"
                style={{ borderColor: `${color}55` }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color }}
                >
                  3º {groupId}
                </span>
                {team && <Flag code={team.code} />}
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {team?.name}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Sticky generate button */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/85 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl justify-center">
          <Button
            size="lg"
            onClick={onGenerate}
            className="group w-full max-w-sm gap-2 rounded-full bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
          >
            Generar fase eliminatoria
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
