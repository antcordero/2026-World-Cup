"use client"

import { useEffect, useState } from "react"
import { GroupStage } from "@/components/group-stage"
import { KnockoutBracket } from "@/components/knockout-bracket"
import {
  createDefaultGroupOrder,
  cleanupWinners,
  type GroupOrder,
  type Winners,
} from "@/lib/tournament"

const STORAGE_KEY = "quiniela-mundial-2026"

type Screen = "groups" | "bracket"

type SavedState = {
  order: GroupOrder
  winners: Winners
  screen: Screen
}

export default function Page() {
  const [order, setOrder] = useState<GroupOrder>(createDefaultGroupOrder)
  const [winners, setWinners] = useState<Winners>({})
  const [screen, setScreen] = useState<Screen>("groups")
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as SavedState
        if (data.order) setOrder(data.order)
        if (data.winners) setWinners(data.winners)
        if (data.screen) setScreen(data.screen)
      }
    } catch (err) {
      console.log("[v0] Error loading state:", err)
    }
    setLoaded(true)
  }, [])

  // Persist
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ order, winners, screen } satisfies SavedState),
      )
    } catch (err) {
      console.log("[v0] Error saving state:", err)
    }
  }, [order, winners, screen, loaded])

  function handleReorder(groupId: string, newOrder: string[]) {
    setOrder((prev) => {
      const next = { ...prev, [groupId]: newOrder }
      // Reordering can invalidate previously picked winners
      setWinners((w) => cleanupWinners(next, w))
      return next
    })
  }

  function handlePick(matchId: string, teamId: string) {
    setWinners((prev) => {
      if (prev[matchId] === teamId) return prev
      const next = { ...prev, [matchId]: teamId }
      return cleanupWinners(order, next)
    })
  }

  function handleReset() {
    if (
      typeof window !== "undefined" &&
      !window.confirm("¿Reiniciar todas las predicciones del cuadro?")
    ) {
      return
    }
    setWinners({})
  }

  if (!loaded) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {screen === "groups" ? (
        <GroupStage
          order={order}
          onReorder={handleReorder}
          onGenerate={() => setScreen("bracket")}
        />
      ) : (
        <KnockoutBracket
          order={order}
          winners={winners}
          onPick={handlePick}
          onBack={() => setScreen("groups")}
          onReset={handleReset}
        />
      )}
    </main>
  )
}
