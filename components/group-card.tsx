"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react"
import { Flag } from "@/components/flag"
import { TEAMS, GROUP_COLORS } from "@/lib/tournament"
import { cn } from "@/lib/utils"

const POS_LABEL = ["1º", "2º", "3º", "4º"]

export function GroupCard({
  groupId,
  teamIds,
  onReorder,
}: {
  groupId: string
  teamIds: string[]
  onReorder: (groupId: string, newOrder: string[]) => void
}) {
  const color = GROUP_COLORS[groupId]
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  function move(from: number, to: number) {
    if (to < 0 || to >= teamIds.length || from === to) return
    const next = [...teamIds]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onReorder(groupId, next)
  }

  function handleDrop(to: number) {
    if (dragIndex === null) return
    move(dragIndex, to)
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div
      className="rounded-2xl border bg-card/70 p-3 backdrop-blur-sm transition-shadow"
      style={{
        borderColor: `${color}66`,
        boxShadow: `0 0 0 1px ${color}22, 0 8px 24px -12px ${color}55`,
      }}
    >
      <div className="mb-2.5 flex items-center justify-between px-1">
        <h3 className="text-sm font-bold tracking-wide text-foreground">
          Grupo {groupId}
        </h3>
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
          aria-hidden
        />
      </div>

      <ul className="flex flex-col gap-1.5">
        {teamIds.map((id, idx) => {
          const team = TEAMS[id]
          const qualifies = idx < 2
          return (
            <li
              key={id}
              draggable
              onDragStart={() => setDragIndex(idx)}
              onDragOver={(e) => {
                e.preventDefault()
                setOverIndex(idx)
              }}
              onDragEnd={() => {
                setDragIndex(null)
                setOverIndex(null)
              }}
              onDrop={() => handleDrop(idx)}
              className={cn(
                "group flex items-center gap-2 rounded-xl border border-transparent bg-secondary/60 px-2 py-1.5 transition-colors",
                qualifies && "bg-secondary",
                overIndex === idx &&
                  dragIndex !== null &&
                  "border-dashed border-primary/70",
                dragIndex === idx && "opacity-50",
              )}
            >
              <GripVertical
                className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/60 active:cursor-grabbing"
                aria-hidden
              />
              <span
                className={cn(
                  "w-5 shrink-0 text-center text-xs font-bold tabular-nums",
                  qualifies ? "text-primary" : "text-muted-foreground",
                )}
              >
                {POS_LABEL[idx]}
              </span>
              <Flag code={team.code} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {team.name}
              </span>
              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  onClick={() => move(idx, idx - 1)}
                  disabled={idx === 0}
                  aria-label={`Subir ${team.name}`}
                  className="flex h-4 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-primary disabled:opacity-25"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, idx + 1)}
                  disabled={idx === teamIds.length - 1}
                  aria-label={`Bajar ${team.name}`}
                  className="flex h-4 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-primary disabled:opacity-25"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
