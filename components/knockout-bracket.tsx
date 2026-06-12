"use client"

import { useRef, useState } from "react"
import { ArrowLeft, Camera, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MatchCard } from "@/components/match-card"
import { ChampionPodium } from "@/components/champion-podium"
import {
  LEFT_MATCHES,
  RIGHT_MATCHES,
  FINAL_MATCH,
  THIRD_MATCH,
  buildSeedMap,
  getMatchTeams,
  type GroupOrder,
  type Winners,
  type MatchDef,
} from "@/lib/tournament"
import { cn } from "@/lib/utils"

type Tab = "left" | "right" | "final"

const ROUND_ORDER = ["r32", "r16", "qf", "sf"] as const

function matchesByRound(matches: MatchDef[]) {
  return ROUND_ORDER.map((r) => matches.filter((m) => m.round === r))
}

export function KnockoutBracket({
  order,
  winners,
  onPick,
  onBack,
  onReset,
}: {
  order: GroupOrder
  winners: Winners
  onPick: (matchId: string, teamId: string) => void
  onBack: () => void
  onReset: () => void
}) {
  const seeds = buildSeedMap(order)
  const [tab, setTab] = useState<Tab>("final")
  const [capturing, setCapturing] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)

  const final = getMatchTeams(FINAL_MATCH.id, seeds, winners)
  const championId = winners[FINAL_MATCH.id] ?? null
  const runnerUpId = championId
    ? championId === final.a
      ? final.b
      : final.a
    : null
  const thirdId = winners[THIRD_MATCH.id] ?? null

  const leftRounds = matchesByRound(LEFT_MATCHES)
  const rightRounds = matchesByRound(RIGHT_MATCHES)

  async function handleDownload() {
    if (!captureRef.current) return
    setCapturing(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#16181f",
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement("a")
      link.download = "quiniela-mundial-2026.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (err) {
      console.log("[v0] Error generating image:", err)
    } finally {
      setCapturing(false)
    }
  }

  function RoundColumn({
    matches,
    side,
  }: {
    matches: MatchDef[]
    side: "left" | "right"
  }) {
    return (
      <div
        className={cn(
          "flex w-[115px] xl:w-[140px] shrink-0 flex-col justify-around gap-2 text-[11px]",
          side === "right" && "items-end",
        )}
      >
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            seeds={seeds}
            winners={winners}
            onPick={onPick}
          />
        ))}
      </div>
    )
  }

  const FinalCenter = (
    <div className="flex flex-col items-center justify-between h-full min-h-[500px] py-4 scale-90 xl:scale-100 origin-center">
      <div className="flex flex-col items-center gap-3 w-full mb-6">
        <div className="text-center">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
            Campeón del Mundo
          </h2>
        </div>
        <ChampionPodium
          champion={championId}
          runnerUp={runnerUpId}
          third={thirdId}
        />
      </div>

      <div className="flex flex-col items-center gap-2 mt-auto">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          Final
        </span>
        <MatchCard
          match={FINAL_MATCH}
          seeds={seeds}
          winners={winners}
          onPick={onPick}
        />
        <span className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          Tercer puesto
        </span>
        <MatchCard
          match={THIRD_MATCH}
          seeds={seeds}
          winners={winners}
          onPick={onPick}
        />
      </div>
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-[1400px] px-2 pb-28 pt-5 sm:pt-8">
      {/* Top bar */}
      <div className="mb-5 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Grupos
        </Button>
        <h1 className="text-balance text-center text-base font-extrabold tracking-tight text-foreground sm:text-xl">
          Cuadro eliminatorio · Mundial 2026
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Reiniciar</span>
        </Button>
      </div>

      {/* Mobile tabs */}
      <div className="mb-4 grid grid-cols-3 gap-1 rounded-full border border-border bg-card/70 p-1 lg:hidden">
        {(
          [
            ["left", "Bloque Izq."],
            ["final", "Fase Final"],
            ["right", "Bloque Der."],
          ] as [Tab, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              "rounded-full px-2 py-1.5 text-xs font-semibold transition-colors",
              tab === value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Capture container */}
      <div ref={captureRef} className="rounded-2xl bg-background p-1 sm:p-3">
        {/* Desktop layout */}
        <div className="hidden overflow-x-hidden lg:block w-full">
          <div className="w-full flex items-stretch justify-between gap-1 xl:gap-2">
            {leftRounds.map((col, i) => (
              <RoundColumn key={`l${i}`} matches={col} side="left" />
            ))}
            <div className="flex w-[200px] xl:w-[250px] shrink-0 items-center justify-center px-1">
              {FinalCenter}
            </div>
            {[...rightRounds].reverse().map((col, i) => (
              <RoundColumn key={`r${i}`} matches={col} side="right" />
            ))}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden">
          {tab === "final" && FinalCenter}
          {tab === "left" && (
            <MobileSide
              rounds={leftRounds}
              seeds={seeds}
              winners={winners}
              onPick={onPick}
            />
          )}
          {tab === "right" && (
            <MobileSide
              rounds={rightRounds}
              seeds={seeds}
              winners={winners}
              onPick={onPick}
            />
          )}
        </div>
      </div>

      {/* Floating share button */}
      {championId && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/85 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl justify-center">
            <Button
              size="lg"
              onClick={handleDownload}
              disabled={capturing}
              className="w-full max-w-sm gap-2 rounded-full bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
              {capturing ? "Generando..." : "Descargar para WhatsApp"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

const ROUND_NAMES: Record<string, string> = {
  r32: "Dieciseisavos",
  r16: "Octavos",
  qf: "Cuartos",
  sf: "Semifinal",
}

function MobileSide({
  rounds,
  seeds,
  winners,
  onPick,
}: {
  rounds: MatchDef[][]
  seeds: Record<string, string | null>
  winners: Winners
  onPick: (matchId: string, teamId: string) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      {rounds.map((col, i) => (
        <div key={i}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
            {ROUND_NAMES[col[0]?.round ?? "r32"]}
          </h3>
          <div className="flex flex-wrap gap-2">
            {col.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                seeds={seeds}
                winners={winners}
                onPick={onPick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}