// Tournament data + bracket logic for World Cup 2026 predictions

export type Team = {
  id: string
  name: string
  code: string // ISO code for flagcdn (e.g. "mx", "gb-sct")
  groupId: string
}

export type GroupOrder = Record<string, string[]> // groupId -> ordered teamIds (1st..4th)
export type Winners = Record<string, string> // matchId -> teamId

// ---- Teams by group ---------------------------------------------------------

type RawTeam = [name: string, code: string]

const RAW_GROUPS: Record<string, RawTeam[]> = {
  A: [
    ["México", "mx"],
    ["Corea del Sur", "kr"],
    ["República Checa", "cz"],
    ["Sudáfrica", "za"],
  ],
  B: [
    ["Suiza", "ch"],
    ["Bosnia-Herzegovina", "ba"],
    ["Canadá", "ca"],
    ["Catar", "qa"],
  ],
  C: [
    ["Escocia", "gb-sct"],
    ["Brasil", "br"],
    ["Haití", "ht"],
    ["Marruecos", "ma"],
  ],
  D: [
    ["Turquía", "tr"],
    ["Paraguay", "py"],
    ["Estados Unidos", "us"],
    ["Australia", "au"],
  ],
  E: [
    ["Alemania", "de"],
    ["Ecuador", "ec"],
    ["Costa de Marfil", "ci"],
    ["Curazao", "cw"],
  ],
  F: [
    ["Suecia", "se"],
    ["Países Bajos", "nl"],
    ["Túnez", "tn"],
    ["Japón", "jp"],
  ],
  G: [
    ["Bélgica", "be"],
    ["Egipto", "eg"],
    ["Irán", "ir"],
    ["Nueva Zelanda", "nz"],
  ],
  H: [
    ["España", "es"],
    ["Uruguay", "uy"],
    ["Cabo Verde", "cv"],
    ["Arabia Saudí", "sa"],
  ],
  I: [
    ["Francia", "fr"],
    ["Noruega", "no"],
    ["Senegal", "sn"],
    ["Irak", "iq"],
  ],
  J: [
    ["Austria", "at"],
    ["Argentina", "ar"],
    ["Argelia", "dz"],
    ["Jordania", "jo"],
  ],
  K: [
    ["Portugal", "pt"],
    ["Colombia", "co"],
    ["RD Congo", "cd"],
    ["Uzbekistán", "uz"],
  ],
  L: [
    ["Croacia", "hr"],
    ["Inglaterra", "gb-eng"],
    ["Ghana", "gh"],
    ["Panamá", "pa"],
  ],
}

export const GROUP_IDS = Object.keys(RAW_GROUPS)

export const TEAMS: Record<string, Team> = {}
for (const groupId of GROUP_IDS) {
  RAW_GROUPS[groupId].forEach(([name, code], idx) => {
    const id = `${groupId}${idx}`
    TEAMS[id] = { id, name, code, groupId }
  })
}

export function createDefaultGroupOrder(): GroupOrder {
  const order: GroupOrder = {}
  for (const groupId of GROUP_IDS) {
    order[groupId] = RAW_GROUPS[groupId].map((_, idx) => `${groupId}${idx}`)
  }
  return order
}

// Neon accent color per group (used for borders / glow)
export const GROUP_COLORS: Record<string, string> = {
  A: "#22c55e",
  B: "#ef4444",
  C: "#f59e0b",
  D: "#3b82f6",
  E: "#a855f7",
  F: "#84cc16",
  G: "#ec4899",
  H: "#14b8a6",
  I: "#8b5cf6",
  J: "#06b6d4",
  K: "#f97316",
  L: "#0ea5e9",
}

// ---- Bracket structure ------------------------------------------------------

export type Ref =
  | { type: "seed"; code: string } // e.g. "1E" => 1st of group E
  | { type: "winner"; matchId: string }
  | { type: "loser"; matchId: string }

export type MatchDef = {
  id: string
  round: "r32" | "r16" | "qf" | "sf" | "final" | "third"
  side: "left" | "right" | "center"
  a: Ref
  b: Ref
}

const LEFT_R32: [string, string][] = [
  ["1E", "3A"],
  ["1I", "3C"],
  ["2A", "2B"],
  ["1F", "2C"],
  ["2K", "2L"],
  ["1H", "2J"],
  ["1D", "3B"],
  ["1G", "3E"],
]

const RIGHT_R32: [string, string][] = [
  ["1C", "2F"],
  ["2E", "2I"],
  ["1A", "3F"],
  ["1L", "3H"],
  ["1J", "2H"],
  ["2D", "2G"],
  ["1B", "3G"],
  ["1K", "3D"],
]

function buildSide(side: "left" | "right", r32: [string, string][]): MatchDef[] {
  const matches: MatchDef[] = []
  // Round of 32 (dieciseisavos) — 8 matches
  r32.forEach(([a, b], i) => {
    matches.push({
      id: `${side}-r32-${i}`,
      round: "r32",
      side,
      a: { type: "seed", code: a },
      b: { type: "seed", code: b },
    })
  })
  // Round of 16 (octavos) — 4 matches
  for (let i = 0; i < 4; i++) {
    matches.push({
      id: `${side}-r16-${i}`,
      round: "r16",
      side,
      a: { type: "winner", matchId: `${side}-r32-${i * 2}` },
      b: { type: "winner", matchId: `${side}-r32-${i * 2 + 1}` },
    })
  }
  // Quarter finals (cuartos) — 2 matches
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: `${side}-qf-${i}`,
      round: "qf",
      side,
      a: { type: "winner", matchId: `${side}-r16-${i * 2}` },
      b: { type: "winner", matchId: `${side}-r16-${i * 2 + 1}` },
    })
  }
  // Semi final — 1 match
  matches.push({
    id: `${side}-sf-0`,
    round: "sf",
    side,
    a: { type: "winner", matchId: `${side}-qf-0` },
    b: { type: "winner", matchId: `${side}-qf-1` },
  })
  return matches
}

export const LEFT_MATCHES = buildSide("left", LEFT_R32)
export const RIGHT_MATCHES = buildSide("right", RIGHT_R32)

export const FINAL_MATCH: MatchDef = {
  id: "final-0",
  round: "final",
  side: "center",
  a: { type: "winner", matchId: "left-sf-0" },
  b: { type: "winner", matchId: "right-sf-0" },
}

export const THIRD_MATCH: MatchDef = {
  id: "third-0",
  round: "third",
  side: "center",
  a: { type: "loser", matchId: "left-sf-0" },
  b: { type: "loser", matchId: "right-sf-0" },
}

export const ALL_MATCHES: MatchDef[] = [
  ...LEFT_MATCHES,
  ...RIGHT_MATCHES,
  FINAL_MATCH,
  THIRD_MATCH,
]

const MATCH_BY_ID: Record<string, MatchDef> = {}
for (const m of ALL_MATCHES) MATCH_BY_ID[m.id] = m

export const ROUND_LABELS: Record<MatchDef["round"], string> = {
  r32: "Dieciseisavos",
  r16: "Octavos",
  qf: "Cuartos",
  sf: "Semifinal",
  final: "Final",
  third: "Tercer puesto",
}

// ---- Resolution -------------------------------------------------------------

// Build seed map from group standings.
// Codes: position (1/2/3) + group letter. Only the 8 best thirds (A..H) qualify.
export function buildSeedMap(order: GroupOrder): Record<string, string | null> {
  const seeds: Record<string, string | null> = {}
  for (const groupId of GROUP_IDS) {
    const teams = order[groupId] ?? []
    seeds[`1${groupId}`] = teams[0] ?? null
    seeds[`2${groupId}`] = teams[1] ?? null
    // 3rd place only counts for groups A..H (fixed best thirds)
    if ("ABCDEFGH".includes(groupId)) {
      seeds[`3${groupId}`] = teams[2] ?? null
    }
  }
  return seeds
}

function resolveRef(
  ref: Ref,
  seeds: Record<string, string | null>,
  winners: Winners,
): string | null {
  if (ref.type === "seed") return seeds[ref.code] ?? null
  if (ref.type === "winner") return winners[ref.matchId] ?? null
  // loser
  const m = MATCH_BY_ID[ref.matchId]
  if (!m) return null
  const w = winners[ref.matchId]
  if (!w) return null
  const a = resolveRef(m.a, seeds, winners)
  const b = resolveRef(m.b, seeds, winners)
  if (!a || !b) return null
  return w === a ? b : a
}

export function getMatchTeams(
  matchId: string,
  seeds: Record<string, string | null>,
  winners: Winners,
): { a: string | null; b: string | null } {
  const m = MATCH_BY_ID[matchId]
  if (!m) return { a: null, b: null }
  return {
    a: resolveRef(m.a, seeds, winners),
    b: resolveRef(m.b, seeds, winners),
  }
}

// Remove winners that are no longer valid for their match (after reorder / re-pick)
export function cleanupWinners(
  order: GroupOrder,
  winners: Winners,
): Winners {
  const seeds = buildSeedMap(order)
  let current = { ...winners }
  let changed = true
  while (changed) {
    changed = false
    for (const m of ALL_MATCHES) {
      const w = current[m.id]
      if (!w) continue
      const { a, b } = getMatchTeams(m.id, seeds, current)
      if (w !== a && w !== b) {
        delete current[m.id]
        changed = true
      }
    }
  }
  return current
}

// The 8 best thirds (fixed to groups A..H per spec)
export const QUALIFIED_THIRD_GROUPS = "ABCDEFGH".split("")

export function getLabelForRef(ref: Ref): string {
  if (ref.type === "seed") {
    const pos = ref.code[0]
    const grp = ref.code.slice(1)
    const posLabel = pos === "1" ? "1º" : pos === "2" ? "2º" : "3º"
    return `${posLabel} ${grp}`
  }
  return ""
}
