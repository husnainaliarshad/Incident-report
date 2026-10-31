import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ChevronDown, Download, FileJson } from 'lucide-react'
import { useReport } from '../context/ReportContext'
import { PageHeader, SectionCard } from '../components/ui'
import { buildSubmission } from '../lib/submission'
import { checkBackend } from '../lib/nocodb'
import { formatDateDMY } from '../lib/dates'

function Row({ label, value }) {
  const display = Array.isArray(value) ? value.join(', ') : value
  if (display === '' || display == null || display === '—') return null
  return (
    <div className="grid grid-cols-1 gap-0.5 border-b border-gray-100 py-2 last:border-0 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{display}</dd>
    </div>
  )
}

export default function ReviewSubmit({ onEditPage }) {
  const { report } = useReport()
  const [showJson, setShowJson] = useState(false)
  const [backend, setBackend] = useState(null)

  useEffect(() => {
    let alive = true
    checkBackend().then((status) => {
      if (alive) setBackend(status)
    })
    return () => {
      alive = false
    }
  }, [])

  const submission = useMemo(() => buildSubmission(report), [report])
  const json = useMemo(() => JSON.stringify(submission, null, 2), [submission])

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `incident-report-${report.gdlNumber || 'draft'}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  const EditButton = ({ page }) => (
    <button
      type="button"
      onClick={() => onEditPage(page)}
      className="text-xs font-semibold text-gd-700 underline decoration-dotted hover:text-gd-900"
    >
      Edit
    </button>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CheckCircle2}
        title="Review & Submit"
        subtitle="Please review your report below. Use the Edit links to change any section, then select Submit Report."
      />

      <SectionCard title="Page 1: Basic Incident Information">
        <div className="mb-2 flex justify-end">
          <EditButton page={0} />
        </div>
        <dl>
          <Row label="Full name" value={report.fullName} />
          <Row label="GDL number" value={report.gdlNumber} />
          <Row label="Role on journey" value={report.role} />
          <Row label="Route number" value={report.routeNumber} />
          <Row label="Date of incident" value={formatDateDMY(report.incidentDate)} />
          <Row label="Journey" value={report.journey} />
          <Row label="Contact number" value={report.contactNumber} />
          <Row label="School name" value={report.schoolName} />
          <Row label="Passenger(s) involved" value={report.passengerNames} />
          <Row label="Where the incident took place" value={report.incidentLocations} />
          <Row label="Location details" value={report.locationDetails} />
          <Row
            label="Vehicle"
            value={report.vehicleType === 'Other' ? report.vehicleOther : report.vehicleType}
          />
          <Row label="Vehicle registration" value={report.vehicleReg} />
          <Row label="Wheelchair accessible" value={report.wheelchairAccessible} />
        </dl>
      </SectionCard>

      <SectionCard title="Page 2: Seating Arrangement">
        <div className="mb-2 flex justify-end">
          <EditButton page={1} />
        </div>
        <dl>
          <Row label="Vehicle type" value={report.vehicleType} />
          <Row
            label="Occupied seats"
            value={Object.entries(report.seats)
              .filter(([, name]) => name?.trim())
              .map(([seat, name]) => `${seat}: ${name}`)}
          />
          <Row label="Additional information" value={report.seatingNotes} />
        </dl>
      </SectionCard>

      <SectionCard title="Page 3: Incident Details">
        <div className="mb-2 flex justify-end">
          <EditButton page={2} />
        </div>
        <dl>
          <Row label="Incident type(s)" value={report.incidentTypes} />
          <Row label="Behaviour(s)" value={report.behaviours} />
          <Row label="Behaviour – injury/medical support" value={report.behaviourInjury} />
          <Row label="Behaviour – injury details" value={report.behaviourInjuryDetails} />
          <Row label="Record method" value={report.recordMethod} />
          <Row label="RTA type" value={report.rtaType === 'Other (please specify)' ? report.rtaTypeOther : report.rtaType} />
          <Row label="Emergency services contacted" value={report.rtaEmergencyServices} />
          <Row label="Medical attention required" value={report.rtaMedicalAttention} />
          <Row label="Damage / breakdown issues" value={report.damageTypes} />
          <Row label="Vehicle unsafe to continue" value={report.vehicleUnsafe} />
          <Row label="Roadside assistance called" value={report.roadsideAssistance} />
        </dl>
      </SectionCard>

      {report.incidentTypes.includes('behaviour') ? (
        <SectionCard title="Page 4: Behaviour Incident Report">
          <div className="mb-2 flex justify-end">
            <EditButton page={3} />
          </div>
          <dl>
            <Row label="Before the incident" value={report.beforeIncident} />
            <Row label="During the incident" value={report.duringIncident} />
            <Row label="Actions taken" value={report.actionsTaken} />
            <Row label="After the incident" value={report.afterIncident} />
            <Row label="Anyone injured" value={report.anyoneInjured} />
            <Row label="Injury details" value={report.injuredWho} />
            <Row label="Safety equipment involved" value={report.safetyEquipment} />
            <Row label="Other people contacted" value={report.otherPeople} />
            <Row label="Anything else" value={report.anythingElse} />
            <Row
              label="Voice recording"
              value={
                report.voiceRecording
                  ? `${report.voiceRecording.language} · ${report.voiceRecording.durationSeconds}s`
                  : 'Not recorded'
              }
            />
          </dl>
          {report.voiceRecording ? (
            <audio controls src={report.voiceRecording.url} className="mt-4 w-full">
              <track kind="captions" />
            </audio>
          ) : null}
        </SectionCard>
      ) : null}

      {report.incidentTypes.includes('rta') || report.incidentTypes.includes('breakdown') ? (
        <SectionCard title="Page 5: RTA / Breakdown Details">
          <div className="mb-2 flex justify-end">
            <EditButton page={report.incidentTypes.includes('behaviour') ? 4 : 3} />
          </div>
          <dl>
            <Row label="RTA event type" value={report.rtaEventType} />
            <Row label="RTA exact location" value={report.rtaExactLocation} />
            <Row label="Other vehicle registration" value={report.rtaOtherVehicleReg} />
            <Row label="Police / emergency reference" value={report.rtaPoliceRef} />
            <Row label="Injuries" value={report.rtaInjuries} />
            <Row label="Road conditions" value={report.roadConditions} />
            <Row label="Weather conditions" value={report.weatherConditions} />
            <Row label="Lighting conditions" value={report.lightingConditions} />
            <Row label="Traffic controls" value={report.trafficControls} />
            <Row label="Direction & vehicle position" value={report.directionPosition} />
            <Row label="Collision / damage details" value={report.collisionDetails} />
            <Row label="Evidence secured" value={report.evidenceSecured} />
            <Row label="Witness details" value={report.witnessDetails} />
            <Row label="All passengers checked" value={report.allPassengersChecked} />
            <Row label="Sketch attached" value={report.sketchDataUrl ? 'Yes' : 'No'} />
            <Row label="Additional factual details" value={report.additionalFacts} />
            <Row label="Mileage at time of issue" value={report.mileage} />
            <Row label="Breakdown exact location" value={report.breakdownLocation} />
            <Row label="Dashboard warning lights" value={report.warningLights} />
            <Row label="Vehicle stopped completely" value={report.vehicleStoppedCompletely} />
            <Row label="Action taken & outcome" value={report.actionTakenOutcome} />
            <Row label="Breakdown additional details" value={report.breakdownOtherDetails} />
          </dl>
        </SectionCard>
      ) : null}

      <SectionCard title="Submission payload">
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              backend?.configured && !backend?.missingColumns?.length ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span className="text-gray-700">
            {backend === null
              ? 'Checking NocoDB connection…'
              : !backend.configured
                ? 'Backend not configured — set NOCODB_API and NOCODB_TABLE_ID in .env'
                : backend.missingColumns?.length
                  ? `Connected to table ${backend.tableId}, but ${backend.missingColumns.length} column(s) are missing`
                  : `Backend ready · table ${backend.tableId}`}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Selecting <strong>Submit Report</strong> writes the full report to your NocoDB table (summary in
          Title, complete JSON in Payload, including the seating arrangement and audio recording). You can
          also download a local copy.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-2 rounded-lg bg-gd-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gd-900"
          >
            <Download size={16} /> Download JSON
          </button>
          <button
            type="button"
            onClick={() => setShowJson((value) => !value)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gd-600"
          >
            <FileJson size={16} /> {showJson ? 'Hide' : 'Preview'} payload
            <ChevronDown size={15} className={showJson ? 'rotate-180 transition' : 'transition'} />
          </button>
        </div>
        {showJson ? (
          <pre className="mt-4 max-h-96 overflow-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
            {json}
          </pre>
        ) : null}
      </SectionCard>
    </div>
  )
}
