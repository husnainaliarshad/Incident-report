import { Minus, Plus } from 'lucide-react'
import { useReport } from '../context/ReportContext'

const PASSENGER_ROWS_3 = (startRow, count) =>
  Array.from({ length: count }, (_, index) => {
    const row = startRow + index
    return [1, 2, 3].map((seat) => ({
      id: `r${row}s${seat}`,
      label: 'Passenger',
      kind: 'passenger',
      prefix: `Row ${row} Seat ${seat}`,
    }))
  })

const LAYOUTS = {
  Car: [
    [
      { id: 'driver', label: 'Driver', kind: 'driver' },
      { id: 'frontPassenger', label: 'Front Passenger', kind: 'assistant' },
    ],
    [1, 2, 3].map((seat) => ({
      id: `rear${seat}`,
      label: 'Passenger',
      kind: 'passenger',
      prefix: `Rear Seat ${seat}`,
    })),
  ],
  'MPV (Small)': [
    [
      { id: 'driver', label: 'Driver', kind: 'driver' },
      { id: 'assistant', label: 'Passenger Assistant', kind: 'assistant' },
    ],
    ...PASSENGER_ROWS_3(2, 2),
  ],
  'MPV (Large)': [
    [
      { id: 'driver', label: 'Driver', kind: 'driver' },
      { id: 'assistant', label: 'Passenger Assistant', kind: 'assistant' },
    ],
    ...PASSENGER_ROWS_3(2, 4),
  ],
  Minibus: [
    [
      { id: 'driver', label: 'Driver', kind: 'driver' },
      { id: 'assistant', label: 'Passenger Assistant', kind: 'assistant' },
    ],
    ...PASSENGER_ROWS_3(2, 4),
  ],
}

const SEAT_STYLES = {
  driver: 'bg-gd-800 ring-gd-900',
  assistant: 'bg-blue-700 ring-blue-900',
  passenger: 'bg-blue-500 ring-blue-700',
}

function Seat({ seat }) {
  const { report, setSeat } = useReport()
  return (
    <label className="flex w-[92px] flex-col items-center gap-1 sm:w-[104px]">
      <span
        className={`w-full rounded-t-md px-1 py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide text-white ring-1 ${SEAT_STYLES[seat.kind]}`}
      >
        {seat.label}
      </span>
      <input
        type="text"
        aria-label={`${seat.prefix ?? seat.label} name`}
        placeholder="Name"
        value={report.seats[seat.id] ?? ''}
        onChange={(event) => setSeat(seat.id, event.target.value)}
        className="w-full rounded-b-md border border-gray-300 bg-white px-1.5 py-1.5 text-center text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-gd-600 focus:ring-2 focus:ring-gd-600/30"
      />
    </label>
  )
}

function VehicleShell({ children }) {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-[2rem] border-4 border-gd-800 bg-gradient-to-b from-gray-50 to-gd-50 p-4 shadow-inner sm:p-6">
      <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-gd-700">
        <span>Front of vehicle</span>
        <span>← Direction of travel</span>
      </div>
      {children}
      <div className="mt-3 rounded-lg border border-dashed border-gd-600/40 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-gd-700">
        Rear of vehicle
      </div>
    </div>
  )
}

export default function SeatingLayout() {
  const { report, setField } = useReport()
  const type = report.vehicleType

  if (type === 'PSV' || type === 'Other') {
    const rows = Array.from({ length: report.psvRowCount }, (_, index) => index + 1)
    return (
      <div className="space-y-4">
        <VehicleShell>
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row} className="flex items-end justify-center gap-6">
                {['A', 'B'].map((column) => (
                  <Seat
                    key={column}
                    seat={{
                      id: `psv-r${row}-${column}`,
                      label: 'Passenger',
                      kind: 'passenger',
                      prefix: `Row ${row} Seat ${column}`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </VehicleShell>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setField('psvRowCount', Math.max(1, report.psvRowCount - 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-gd-600"
          >
            <Minus size={15} /> Remove row
          </button>
          <span className="text-sm text-gray-600">Rows: {report.psvRowCount}</span>
          <button
            type="button"
            onClick={() => setField('psvRowCount', Math.min(12, report.psvRowCount + 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-gd-600"
          >
            <Plus size={15} /> Add row
          </button>
        </div>
      </div>
    )
  }

  const layout = LAYOUTS[type] ?? LAYOUTS['MPV (Small)']
  return (
    <VehicleShell>
      <div className="space-y-3">
        {layout.map((row, index) => (
          <div key={index}>
            <div className={`flex flex-wrap ${index === 0 ? 'justify-between' : 'justify-center'} gap-3`}>
              {row.map((seat) => (
                <Seat key={seat.id} seat={seat} />
              ))}
            </div>
            {index === 0 ? <div className="my-3 border-t-2 border-dashed border-gd-600/30" /> : null}
          </div>
        ))}
      </div>
    </VehicleShell>
  )
}
