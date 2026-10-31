import { FileText, Mic } from 'lucide-react'
import { useReport } from '../context/ReportContext'
import { CheckboxGroup, Field, PageHeader, RadioGroup, SectionCard, Textarea } from '../components/ui'
import VoiceRecorder from '../components/VoiceRecorder'

const BEFORE = [
  'Normal journey (no issues)',
  'Passenger was unsettled',
  'Passenger was asking to get off',
  'Disagreement with another passenger',
  'Change in routine (e.g. different driver/route)',
  'Other',
]

const DURING = [
  'Challenging behaviour',
  'Physical aggression',
  'Verbal aggression',
  'Refusal to remain seated',
  'Attempted to leave the vehicle',
  'Damage to vehicle or property',
  'Injury to self',
  'Injury to others',
  'Road Traffic Incident (RTA)',
  'Other',
]

const ACTIONS = [
  'Verbal reassurance',
  'Asked passenger to remain seated',
  'Stopped the vehicle safely',
  'Contacted GD Office',
  'Contacted school',
  'Contacted parent/carer',
  'Emergency services contacted',
  'No action required',
  'Other',
]

const AFTER = [
  'Journey continued as planned',
  'Passenger calmed down',
  'Passenger was collected by school staff',
  'Passenger was collected by parent/carer',
  'Passenger was not able to travel',
  'Vehicle returned to depot',
  'Ongoing concern',
  'Other',
]

const SAFETY_EQUIPMENT = ['Seat belt', 'Harness', 'Booster seat', 'Wheelchair restraint', 'Other', 'None']

const OTHER_PEOPLE = ['School staff', 'Parent/carer', 'GD Office', 'Emergency services', 'Other', 'Nobody else']

export default function Page4BehaviourReport({ errors = [] }) {
  const { report, setField, toggleArrayValue, toggleExclusiveValue } = useReport()
  const bad = (field) => errors.some((item) => item.field === field)
  const isVoice = report.recordMethod !== 'written'

  return (
    <div className="space-y-6">
      <PageHeader
        icon={isVoice ? Mic : FileText}
        title={isVoice ? 'Page 4: Behaviour Incident Report – Voice Recording' : 'Page 4: Behaviour Incident Report – Written Report'}
        subtitle="Please answer the questions below. These help ensure that all important information is captured. All fields marked * are required."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Before the incident" subtitle="What was happening immediately before the incident? (Select all that apply)">
          <CheckboxGroup
            options={BEFORE}
            values={report.beforeIncident}
            onToggle={(value) => toggleArrayValue('beforeIncident', value)}
            otherOption="Other"
            otherValue={report.beforeIncidentOther}
            onOtherChange={(value) => setField('beforeIncidentOther', value)}
            otherPlaceholder="Please specify"
          />
        </SectionCard>

        <SectionCard title="During the incident" subtitle="What happened during the incident? (Select all that apply)">
          <CheckboxGroup
            options={DURING}
            values={report.duringIncident}
            onToggle={(value) => toggleArrayValue('duringIncident', value)}
            otherOption="Other"
            otherValue={report.duringIncidentOther}
            onOtherChange={(value) => setField('duringIncidentOther', value)}
            otherPlaceholder="Please specify"
          />
        </SectionCard>

        <SectionCard title="Actions taken" subtitle="What action did the Driver and/or Passenger Assistant take? (Select all that apply)">
          <CheckboxGroup
            options={ACTIONS}
            values={report.actionsTaken}
            onToggle={(value) => toggleArrayValue('actionsTaken', value)}
            otherOption="Other"
            otherValue={report.actionsTakenOther}
            onOtherChange={(value) => setField('actionsTakenOther', value)}
            otherPlaceholder="Please specify"
          />
        </SectionCard>

        <SectionCard title="After the incident" subtitle="What happened after the incident? (Select all that apply)">
          <CheckboxGroup
            options={AFTER}
            values={report.afterIncident}
            onToggle={(value) => toggleArrayValue('afterIncident', value)}
            otherOption="Other"
            otherValue={report.afterIncidentOther}
            onOtherChange={(value) => setField('afterIncidentOther', value)}
            otherPlaceholder="Please specify"
          />
        </SectionCard>
      </div>

      <SectionCard title="Safety and injuries">
        <Field
          label="Was anyone injured?"
          required
          error={bad('anyoneInjured') && 'Select an option'}
        >
          <RadioGroup
            name="anyoneInjured"
            options={['Yes', 'No']}
            value={report.anyoneInjured}
            error={bad('anyoneInjured')}
            onChange={(value) => setField('anyoneInjured', value)}
            columns={2}
          />
        </Field>
        {report.anyoneInjured === 'Yes' ? (
          <Field
            label="If yes, who was injured and what injury was observed?"
            required
            error={bad('injuredWho') && 'Please describe who was injured'}
          >
            <Textarea
              rows={3}
              placeholder="Enter details"
              value={report.injuredWho}
              error={bad('injuredWho')}
              onChange={(event) => setField('injuredWho', event.target.value)}
            />
          </Field>
        ) : null}

        <Field
          label="Was any safety equipment involved? (Select all that apply)"
          hint="Selecting “None” clears the other options."
        >
          <CheckboxGroup
            options={SAFETY_EQUIPMENT}
            values={report.safetyEquipment}
            onToggle={(value) => toggleExclusiveValue('safetyEquipment', value, ['None'])}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Other people involved">
        <Field
          label="Were any other people or organisations contacted? (Select all that apply)"
          hint="Selecting “Nobody else” clears the other options."
        >
          <CheckboxGroup
            options={OTHER_PEOPLE}
            values={report.otherPeople}
            onToggle={(value) => toggleExclusiveValue('otherPeople', value, ['Nobody else'])}
            otherOption="Other"
            otherValue={report.otherPeopleOther}
            onOtherChange={(value) => setField('otherPeopleOther', value)}
            otherPlaceholder="Please specify"
          />
        </Field>

        <Field label="Is there anything else we should know?">
          <Textarea
            rows={4}
            placeholder="Enter additional information (optional)"
            value={report.anythingElse}
            onChange={(event) => setField('anythingElse', event.target.value)}
          />
        </Field>
      </SectionCard>

      <VoiceRecorder />
    </div>
  )
}

export function validate(report) {
  const errors = []
  if (!report.anyoneInjured) errors.push({ field: 'anyoneInjured', label: 'Whether anyone was injured' })
  if (report.anyoneInjured === 'Yes' && !report.injuredWho)
    errors.push({ field: 'injuredWho', label: 'Injury details' })
  return errors
}
