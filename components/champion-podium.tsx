"use client"

import { Trophy, Medal } from "lucide-react"
import { Flag } from "@/components/flag"
import { TEAMS } from "@/lib/tournament"

export function ChampionPodium({
  champion,
  runnerUp,
  third,
}: {
  champion: string | null
  runnerUp: string | null
  third: string | null
}) {
  const champTeam = champion ? TEAMS[champion] : null
  const runnerTeam = runnerUp ? TEAMS[runnerUp] : null
  const thirdTeam = third ? TEAMS[third] : null

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-end justify-center gap-3 sm:gap-5">
        {/* Runner up */}
        <Slot
          team={runnerTeam}
          label="Subcampeón"
          accent="text-zinc-300"
          ring="ring-zinc-400/40"
          size="sm"
          icon={<Medal className="h-4 w-4 text-zinc-300" />}
        />
        {/* Champion */}
        <Slot
          team={champTeam}
          label="Campeón"
          accent="text-primary"
          ring="ring-primary/60"
          size="lg"
          icon={<Trophy className="h-5 w-5 text-primary" />}
        />
        {/* Third */}
        <Slot
          team={thirdTeam}
          label="3er puesto"
          accent="text-amber-700"
          ring="ring-amber-700/40"
          size="sm"
          icon={<Medal className="h-4 w-4 text-amber-600" />}
        />
      </div>
    </div>
  )
}

function Slot({
  team,
  label,
  accent,
  ring,
  size,
  icon,
}: {
  team: { name: string; code: string } | null
  label: string
  accent: string
  ring: string
  size: "sm" | "lg"
  icon: React.ReactNode
}) {
  const big = size === "lg"
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      {icon}
      <div
        className={`flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card/80 ring-2 ${ring} ${
          big ? "h-24 w-24 sm:h-28 sm:w-28" : "h-20 w-20 sm:h-24 sm:w-24"
        }`}
      >
        {team ? (
          <>
            <Flag code={team.code} className="h-7 w-10" />
            <span className="px-1 text-[11px] font-bold leading-tight text-foreground">
              {team.name}
            </span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>
      <span className={`text-[11px] font-bold uppercase tracking-wide ${accent}`}>
        {label}
      </span>
    </div>
  )
}
