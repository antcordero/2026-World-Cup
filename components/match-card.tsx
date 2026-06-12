"use client"

import { Flag } from "@/components/flag"
import {
  TEAMS,
  getMatchTeams,
  getLabelForRef,
  ROUND_LABELS,
  type MatchDef,
  type Winners,
} from "@/lib/tournament"
import { cn } from "@/lib/utils"

function TeamRow({
  teamId,
  placeholder,
  isWinner,
  decided,
  onPick,
}: {
  teamId: string | null
  placeholder: string
  isWinner: boolean
  decided: boolean
  onPick: () => void
}) {
  const team = teamId ? TEAMS[teamId] : null
  return (
    <button
      type="button"
      disabled={!team}
      onClick={onPick}
      className={cn(
        "flex w-full items-center gap-2 px-2.5 py-1.5 text-left transition-colors",
        team ? "cursor-pointer hover:bg-primary/10" : "cursor-default",
        isWinner && "bg-primary/15",
        decided && !isWinner && "opacity-40",
      )}
    >
      {team ? (
        <Flag code={team.code} className="h-[15px] w-[22px]" />
      ) : (
        <span className="h-[15px] w-[22px] shrink-0 rounded-[2px] bg-muted" />
      )}
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[13px]",
          isWinner ? "font-bold text-foreground" : "font-medium text-muted-foreground",
          team && "text-foreground",
        )}
      >
        {team ? team.name : placeholder}
      </span>
      {isWinner && (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
      )}
    </button>
  )
}

export function MatchCard({
  match,
  seeds,
  winners,
  onPick,
  showRound,
}: {
  match: MatchDef
  seeds: Record<string, string | null>
  winners: Winners
  onPick: (matchId: string, teamId: string) => void
  showRound?: boolean
}) {
  const { a, b } = getMatchTeams(match.id, seeds, winners)
  const winner = winners[match.id]
  const decided = Boolean(winner)

  return (
    <div className="w-[168px] overflow-hidden rounded-lg border border-border bg-card/80 shadow-sm sm:w-[176px]">
      {showRound && (
        <div className="border-b border-border/60 bg-secondary/40 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          {ROUND_LABELS[match.round]}
        </div>
      )}
      <TeamRow
        teamId={a}
        placeholder={getLabelForRef(match.a) || "Por definir"}
        isWinner={decided && winner === a}
        decided={decided}
        onPick={() => a && onPick(match.id, a)}
      />
      <div className="h-px bg-border/60" />
      <TeamRow
        teamId={b}
        placeholder={getLabelForRef(match.b) || "Por definir"}
        isWinner={decided && winner === b}
        decided={decided}
        onPick={() => b && onPick(match.id, b)}
      />
    </div>
  )
}
