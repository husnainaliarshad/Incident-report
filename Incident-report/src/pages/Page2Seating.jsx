import { Armchair, Info } from 'lucide-react'
import { useReport } from '../context/ReportContext'
import { PageHeader, SectionCard } from '../components/ui'
import SeatingLayout from '../components/SeatingLayout'

export default function Page2Seating() {
  const { report, setField } = useReport()

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Armchair}
        title="Page 2: Seating Arrangement"
        subtitle="Please enter the name of the passenger or staff member occupying each relevant seat."
        badge={report.vehicleType ? `Vehicle: ${report.vehicleType}` : undefined}
      />

      <div className="flex items-start gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900 ring-1 ring-blue-200">
        <Info size={18} className="mt-0.5 shrink-0" />
        <p>
          If a seat was unoccupied, please leave it blank. Enter the name of the passenger or staff member
          in each relevant seat.
        </p>
      </div>

      <SectionCard
        title="Vehicle seating plan"
        subtitle={
          report.vehicleType
            ? `Layout generated for ${report.vehicleType}.`
            : 'Select a vehicle type on Page 1 to generate the seating plan.'
        }
      >
        {report.vehicleType ? (
          <SeatingLayout />
        ) : (
          <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            No vehicle type selected yet.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Additional information (optional)">
        <div>
          <p className="mb-1.5 text-sm text-gray-500">
            If there is anything else about the seating arrangement that may be relevant (e.g. passenger
            moved seats during the journey), please provide details below.
          </p>
          <textarea
            rows={4}
            maxLength={500}
            placeholder="Enter details here..."
            value={report.seatingNotes}
            onChange={(event) => setField('seatingNotes', event.target.value)}
            className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gd-600 focus:ring-2 focus:ring-gd-600/30"
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {report.seatingNotes.length}/500 characters
          </p>
        </div>
      </SectionCard>
    </div>
  )
}

export function validate() {
  return []
}
