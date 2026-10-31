import { ClipboardList, FileText, Info, Mic } from 'lucide-react'
import { useReport } from '../context/ReportContext'
import {
  CardRadio,
  CheckboxGroup,
  Field,
  InfoCallout,
  PageHeader,
  RadioGroup,
  SectionCard,
  TextInput,
  Textarea,
} from '../components/ui'

const INCIDENT_TYPES = [
  { value: 'behaviour', label: 'Behaviour incident' },
  { value: 'rta', label: 'Road Traffic Incident (RTA)' },
  { value: 'breakdown', label: 'Vehicle damage or breakdown' },
]

const BEHAVIOURS = [
  'Physical aggression',
  'Verbal aggression',
  'Refusal to board',
  'Refusal to remain seated',
  'Challenging behaviour',
  'Hygiene issue',
  'Self-harm',
  'Behaviour towards Driver / Passenger Assistant',
  'Behaviour towards another passenger',
  'Damage to property',
  'Other (please specify)',
]

const RTA_TYPES = [
  'Collision with another vehicle',
  'Collision with a pedestrian',
  'Single vehicle incident',
  'Near miss',
  'Other (please specify)',
]

const DAMAGE_TYPES = [
  'Mechanical breakdown',
  'Vehicle damage (e.g. collision, scrape)',
  'Tyre issue (e.g. puncture)',
  'Engine problem',
  'Electrical fault',
  'Warning light / system fault',
  'Other (please specify)',
]

export default function Page3IncidentDetails({ errors = [] }) {
  const { report, setField, toggleArrayValue } = useReport()
  const bad = (field) => errors.some((item) => item.field === field)
  const hasBehaviour = report.incidentTypes.includes('behaviour')
  const hasRta = report.incidentTypes.includes('rta')
  const hasBreakdown = report.incidentTypes.includes('breakdown')
  const selectedCount = report.incidentTypes.length

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="Page 3: Incident Details"
        subtitle="Select what happened and we will show only the sections you need. All fields marked * are required."
        badge={selectedCount ? `${selectedCount} type${selectedCount > 1 ? 's' : ''} selected` : undefined}
      />

      <SectionCard title="What type of incident are you reporting?">
        <Field
          label="Select all that apply"
          required
          error={bad('incidentTypes') && 'Select at least one incident type'}
        >
          <CheckboxGroup
            options={INCIDENT_TYPES}
            values={report.incidentTypes}
            onToggle={(value) => toggleArrayValue('incidentTypes', value)}
            error={bad('incidentTypes')}
          />
        </Field>
      </SectionCard>

      {selectedCount === 0 ? (
        <InfoCallout tone="amber" icon={Info}>
          Select one or more incident types above — the matching sections will appear below.
        </InfoCallout>
      ) : null}

      {hasBehaviour ? (
        <SectionCard
          letter="A"
          title="Behaviour Incident Report"
          subtitle="Only shown because you selected a behaviour incident."
        >
          <Field
            label="What behaviour(s) best describe the incident? (Select all that apply)"
            required
            error={bad('behaviours') && 'Select at least one behaviour'}
          >
            <CheckboxGroup
              options={BEHAVIOURS}
              values={report.behaviours}
              onToggle={(value) => toggleArrayValue('behaviours', value)}
              error={bad('behaviours')}
              otherOption="Other (please specify)"
              otherValue={report.behaviourOtherDetails}
              onOtherChange={(value) => setField('behaviourOtherDetails', value)}
              otherPlaceholder="Enter details"
            />
          </Field>

          <Field
            label="Did the incident result in any injury or medical support?"
            required
            error={bad('behaviourInjury') && 'Select an option'}
          >
            <RadioGroup
              name="behaviourInjury"
              options={[
                { value: 'No', label: 'No' },
                { value: 'Yes', label: 'Yes (please provide details)' },
              ]}
              value={report.behaviourInjury}
              error={bad('behaviourInjury')}
              onChange={(value) => setField('behaviourInjury', value)}
              columns={2}
            />
          </Field>
          {report.behaviourInjury === 'Yes' ? (
            <Field
              label="Injury / medical support details"
              required
              error={bad('behaviourInjuryDetails') && 'Please describe the injury or medical support'}
            >
              <Textarea
                rows={3}
                placeholder="Describe the injury and any medical support given"
                value={report.behaviourInjuryDetails}
                error={bad('behaviourInjuryDetails')}
                onChange={(event) => setField('behaviourInjuryDetails', event.target.value)}
              />
            </Field>
          ) : null}

          <Field
            label="How would you like to record the incident?"
            required
            error={bad('recordMethod') && 'Choose voice or written'}
          >
            <CardRadio
              name="recordMethod"
              error={bad('recordMethod')}
              options={[
                {
                  value: 'voice',
                  label: 'Voice Recording',
                  description: 'Record the incident using your voice.',
                  icon: Mic,
                },
                {
                  value: 'written',
                  label: 'Written Report',
                  description: 'Type your answers in writing.',
                  icon: FileText,
                },
              ]}
              value={report.recordMethod}
              onChange={(value) => setField('recordMethod', value)}
            />
          </Field>
        </SectionCard>
      ) : null}

      {hasRta ? (
        <SectionCard
          letter="B"
          title="RTA - Road Traffic Incident"
          subtitle="Only shown because you selected a road traffic incident."
        >
          <Field
            label="What type of RTA incident was it?"
            required
            error={bad('rtaType') && 'Select the type of RTA incident'}
          >
            <RadioGroup
              name="rtaType"
              options={RTA_TYPES}
              value={report.rtaType}
              error={bad('rtaType')}
              onChange={(value) => setField('rtaType', value)}
              columns={2}
            />
          </Field>
          {report.rtaType === 'Other (please specify)' ? (
            <Field
              label="Other RTA type"
              required
              error={bad('rtaTypeOther') && 'Please describe the RTA type'}
            >
              <TextInput
                placeholder="Enter details"
                value={report.rtaTypeOther}
                error={bad('rtaTypeOther')}
                onChange={(event) => setField('rtaTypeOther', event.target.value)}
              />
            </Field>
          ) : null}

          <Field
            label="Were the emergency services contacted?"
            required
            error={bad('rtaEmergencyServices') && 'Select an option'}
          >
            <RadioGroup
              name="rtaEmergencyServices"
              options={['Yes', 'No', 'Not applicable']}
              value={report.rtaEmergencyServices}
              error={bad('rtaEmergencyServices')}
              onChange={(value) => setField('rtaEmergencyServices', value)}
              columns={2}
            />
          </Field>

          <Field
            label="Did anyone require medical attention?"
            required
            error={bad('rtaMedicalAttention') && 'Select an option'}
          >
            <RadioGroup
              name="rtaMedicalAttention"
              options={[
                { value: 'No', label: 'No' },
                { value: 'Yes', label: 'Yes (please provide details)' },
              ]}
              value={report.rtaMedicalAttention}
              error={bad('rtaMedicalAttention')}
              onChange={(value) => setField('rtaMedicalAttention', value)}
              columns={2}
            />
          </Field>
          {report.rtaMedicalAttention === 'Yes' ? (
            <Field
              label="Medical attention details"
              required
              error={bad('rtaMedicalDetails') && 'Please provide the medical details'}
            >
              <Textarea
                rows={3}
                placeholder="Describe who needed medical attention and what was provided"
                value={report.rtaMedicalDetails}
                error={bad('rtaMedicalDetails')}
                onChange={(event) => setField('rtaMedicalDetails', event.target.value)}
              />
            </Field>
          ) : null}
        </SectionCard>
      ) : null}

      {hasBreakdown ? (
        <SectionCard
          letter="C"
          title="Vehicle Damage or Vehicle Breakdown"
          subtitle="Only shown because you selected vehicle damage or a breakdown."
        >
          <Field
            label="What type of issue occurred? (Select all that apply)"
            required
            error={bad('damageTypes') && 'Select at least one issue'}
          >
            <CheckboxGroup
              options={DAMAGE_TYPES}
              values={report.damageTypes}
              onToggle={(value) => toggleArrayValue('damageTypes', value)}
              error={bad('damageTypes')}
              otherOption="Other (please specify)"
              otherValue={report.damageOtherDetails}
              onOtherChange={(value) => setField('damageOtherDetails', value)}
              otherPlaceholder="Enter details"
            />
          </Field>

          <Field
            label="Did the vehicle become unsafe to continue the journey?"
            required
            error={bad('vehicleUnsafe') && 'Select an option'}
          >
            <RadioGroup
              name="vehicleUnsafe"
              options={['Yes', 'No']}
              value={report.vehicleUnsafe}
              error={bad('vehicleUnsafe')}
              onChange={(value) => setField('vehicleUnsafe', value)}
              columns={2}
            />
          </Field>

          <Field
            label="Was roadside assistance or a recovery service called?"
            required
            error={bad('roadsideAssistance') && 'Select an option'}
          >
            <RadioGroup
              name="roadsideAssistance"
              options={['Yes', 'No', 'Not applicable']}
              value={report.roadsideAssistance}
              error={bad('roadsideAssistance')}
              onChange={(value) => setField('roadsideAssistance', value)}
              columns={2}
            />
          </Field>
        </SectionCard>
      ) : null}
    </div>
  )
}

export function validate(report) {
  const errors = []
  const push = (field, label) => errors.push({ field, label })

  if (!report.incidentTypes.length) {
    push('incidentTypes', 'Incident type')
    return errors
  }

  if (report.incidentTypes.includes('behaviour')) {
    if (!report.behaviours.length) push('behaviours', 'Behaviour(s) describing the incident')
    if (!report.behaviourInjury) push('behaviourInjury', 'Whether the incident resulted in injury or medical support')
    if (report.behaviourInjury === 'Yes' && !report.behaviourInjuryDetails)
      push('behaviourInjuryDetails', 'Injury / medical support details')
    if (!report.recordMethod) push('recordMethod', 'How you would like to record the incident')
  }

  if (report.incidentTypes.includes('rta')) {
    if (!report.rtaType) push('rtaType', 'Type of RTA incident')
    if (report.rtaType === 'Other (please specify)' && !report.rtaTypeOther)
      push('rtaTypeOther', 'Other RTA type details')
    if (!report.rtaEmergencyServices) push('rtaEmergencyServices', 'Whether emergency services were contacted')
    if (!report.rtaMedicalAttention) push('rtaMedicalAttention', 'Whether anyone required medical attention')
    if (report.rtaMedicalAttention === 'Yes' && !report.rtaMedicalDetails)
      push('rtaMedicalDetails', 'Medical attention details')
  }

  if (report.incidentTypes.includes('breakdown')) {
    if (!report.damageTypes.length) push('damageTypes', 'Type of issue that occurred')
    if (!report.vehicleUnsafe) push('vehicleUnsafe', 'Whether the vehicle became unsafe')
    if (!report.roadsideAssistance) push('roadsideAssistance', 'Whether roadside assistance was called')
  }

  return errors
}
