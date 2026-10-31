const BODY = 'M50 6 C22 6 12 22 12 44 L12 156 C12 176 22 194 50 194 C78 194 88 176 88 156 L88 44 C88 22 78 6 50 6 Z'

export const VEHICLE_TYPES = [
  { value: 'Car', rows: 1 },
  { value: 'MPV (Small)', rows: 3 },
  { value: 'MPV (Large)', rows: 4 },
  { value: 'Minibus', rows: 5 },
  { value: 'PSV', rows: 4 },
  { value: 'Other', rows: 3 },
]

function Body({ children }) {
  return (
    <svg viewBox="0 0 100 200" className="h-24 w-12 shrink-0" aria-hidden="true">
      <path d={BODY} fill="#eef6f1" stroke="#134e35" strokeWidth="2.5" />
      <path d="M20 46 L80 46" stroke="#134e35" strokeWidth="2" opacity="0.5" />
      <path d="M20 34 Q50 22 80 34" stroke="#134e35" strokeWidth="2" fill="none" opacity="0.5" />
      {children}
    </svg>
  )
}

export function VehicleDiagram({ type }) {
  const config = VEHICLE_TYPES.find((item) => item.value === type)
  const rows = config?.rows ?? 3
  const seatRows = Array.from({ length: rows })
  return (
    <Body>
      {seatRows.map((_, rowIndex) => {
        const y = 66 + rowIndex * 26
        const last = rowIndex === rows - 1
        const seats = last && rows > 2 ? [30, 50, 70] : [30, 70]
        return seats.map((x) => (
          <rect
            key={`${rowIndex}-${x}`}
            x={x - 7}
            y={y}
            width="14"
            height="14"
            rx="3"
            fill={rowIndex === 0 && x === 30 ? '#134e35' : '#2a7a58'}
            opacity="0.85"
          />
        ))
      })}
    </Body>
  )
}
