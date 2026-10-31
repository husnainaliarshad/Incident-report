import { Wrench } from 'lucide-react'
import { useReport } from '../context/ReportContext'
import { CheckboxGroup, Field, PageHeader, RadioGroup, SectionCard, TextInput, Textarea } from '../components/ui'
import SketchPad from '../components/SketchPad'

const EVENT_TYPES = [
  'Collision with another vehicle',
  'Collision with a pedestrian',
  'Single vehicle incident',
  'Near miss',
  'Third party involved',
  'Other',
]

const COLLISION_TYPES = [
  'Collision with another vehicle',
  'Collision with a pedestrian',
  'Third party involved',
  'Single vehicle incident',
]

const ROAD_CONDITIONS = ['Dry', 'Wet', 'Icy / snowy', 'Flooded', 'Loose surface', 'Roadworks', 'Other']
const WEATHER_CONDITIONS = ['Clear', 'Rain', 'Snow', 'Fog', 'Windy', 'Other']
const EVIDENCE = ['Photos', 'Dashcam', 'CCTV', 'Witness details']

const OUTCOMES = [
  'Pulled over safely',
  'Contacted breakdown service',
  'Vehicle recovered',
  'Passengers transferred to another vehicle',
  'Continued journey after check',
  'Passengers collected by parent/carer',
  'Other',
]

export default function Page5DedicatedDetails({ errors = [] }) {
  const { report, setField, toggleArrayValue } = useReport()
  const bad = (field) => errors.some((item) => item.field === field)
  const hasRta = report.incidentTypes.includes('rta')
  const hasBreakdown = report.incidentTypes.includes('breakdown')
  const isCollision = report.rtaEventType.some((type) => COLLISION_TYPES.includes(type))
  const hasWitnesses = report.evidenceSecured.includes('Witness details')

  const title =
    hasRta && hasBreakdown
      ? 'Page 5: RTA / Near Miss & Breakdown Details'
      : hasRta
        ? 'Page 5: RTA / Near Miss Details'
        : 'Page 5: Vehicle Damage / Breakdown Details'

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Wrench}
        title={title}
        subtitle="You selected Road Traffic Incident (RTA) and/or Vehicle Damage or Breakdown. Please provide the supplementary details below."
      />

      {hasRta ? (
        <>
          <SectionCard letter="A" title="Event and parties">
            <Field
              label="Event type"
              required
              error={bad('rtaEventType') && 'Select at least one event type'}
            >
              <CheckboxGroup
                options={EVENT_TYPES}
                values={report.rtaEventType}
                onToggle={(value) => toggleArrayValue('rtaEventType', value)}
                error={bad('rtaEventType')}
                otherOption="Other"
                otherValue={report.rtaEventTypeOther}
                onOtherChange={(value) => setField('rtaEventTypeOther', value)}
                otherPlaceholder="Please describe the event type"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Exact location"
                required
                error={bad('rtaExactLocation') && 'Please enter the exact location'}
              >
                <TextInput
                  placeholder="Enter the exact location"
                  value={report.rtaExactLocation}
                  error={bad('rtaExactLocation')}
                  onChange={(event) => setField('rtaExactLocation', event.target.value)}
                />
              </Field>
              {isCollision ? (
                <Field label="Other vehicle registration number">
                  <TextInput
                    placeholder="Example: AB12 CDE"
                    maxLength={10}
                    value={report.rtaOtherVehicleReg}
                    onChange={(event) =>
                      setField('rtaOtherVehicleReg', event.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, ''))
                    }
                  />
                </Field>
              ) : null}
              <Field label="Police / emergency reference number(s)">
                <TextInput
                  placeholder="Enter reference number(s)"
                  value={report.rtaPoliceRef}
                  onChange={(event) => setField('rtaPoliceRef', event.target.value)}
                />
              </Field>
            </div>

            {isCollision ? (
              <Field label="Other driver / party details">
                <Textarea
                  rows={3}
                  placeholder="Enter names, contact details and insurer information"
                  value={report.rtaOtherPartyDetails}
                  onChange={(event) => setField('rtaOtherPartyDetails', event.target.value)}
                />
              </Field>
            ) : null}

            <Field
              label="Injuries"
              required
              error={bad('rtaInjuries') && 'Please describe any injuries (or state none)'}
            >
              <Textarea
                rows={3}
                placeholder="Describe any injuries and who was affected"
                value={report.rtaInjuries}
                error={bad('rtaInjuries')}
                onChange={(event) => setField('rtaInjuries', event.target.value)}
              />
            </Field>
          </SectionCard>

          <SectionCard letter="B" title="Conditions, evidence and vehicle position">
            <div className="grid gap-5 lg:grid-cols-2">
              <Field label="Road conditions">
                <CheckboxGroup
                  options={ROAD_CONDITIONS}
                  values={report.roadConditions}
                  onToggle={(value) => toggleArrayValue('roadConditions', value)}
                />
              </Field>
              <Field label="Weather conditions">
                <CheckboxGroup
                  options={WEATHER_CONDITIONS}
                  values={report.weatherConditions}
                  onToggle={(value) => toggleArrayValue('weatherConditions', value)}
                />
              </Field>
            </div>

            <Field label="Lighting conditions">
              <RadioGroup
                name="lightingConditions"
                options={['Daylight', 'Dusk / dawn', 'Darkness – streetlit', 'Darkness – unlit']}
                value={report.lightingConditions[0]}
                onChange={(value) => setField('lightingConditions', [value])}
                columns={2}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Traffic controls">
                <TextInput
                  placeholder="e.g. traffic lights, give way sign, none"
                  value={report.trafficControls}
                  onChange={(event) => setField('trafficControls', event.target.value)}
                />
              </Field>
              <Field
                label="Were all passengers checked?"
                required
                error={bad('allPassengersChecked') && 'Select an option'}
              >
                <RadioGroup
                  name="allPassengersChecked"
                  options={['Yes', 'No']}
                  value={report.allPassengersChecked}
                  error={bad('allPassengersChecked')}
                  onChange={(value) => setField('allPassengersChecked', value)}
                  columns={2}
                />
              </Field>
            </div>

            <Field label="Direction of travel and vehicle position">
              <Textarea
                rows={3}
                placeholder="Describe direction of travel and position of vehicles on the road"
                value={report.directionPosition}
                onChange={(event) => setField('directionPosition', event.target.value)}
              />
            </Field>

            {isCollision ? (
              <Field
                label="Collision / damage details"
                required
                error={bad('collisionDetails') && 'Please describe the collision and damage'}
              >
                <Textarea
                  rows={3}
                  placeholder="Describe the collision and any damage caused"
                  value={report.collisionDetails}
                  error={bad('collisionDetails')}
                  onChange={(event) => setField('collisionDetails', event.target.value)}
                />
              </Field>
            ) : null}

            <Field label="Evidence secured (Select all that apply)">
              <CheckboxGroup
                options={EVIDENCE}
                values={report.evidenceSecured}
                onToggle={(value) => toggleArrayValue('evidenceSecured', value)}
              />
            </Field>

            {hasWitnesses ? (
              <Field label="Witness details">
                <Textarea
                  rows={3}
                  placeholder="Enter witness names and contact details"
                  value={report.witnessDetails}
                  onChange={(event) => setField('witnessDetails', event.target.value)}
                />
              </Field>
            ) : null}
          </SectionCard>

          <SectionCard letter="C" title="Sketch or additional factual details">
            <Field label="Add a sketch or diagram here showing road layout, vehicle positions, direction of travel etc.">
              <SketchPad value={report.sketchDataUrl} onChange={(value) => setField('sketchDataUrl', value)} />
            </Field>

            <Field label="Additional factual details">
              <Textarea
                rows={4}
                placeholder="Enter any additional factual details"
                value={report.additionalFacts}
                onChange={(event) => setField('additionalFacts', event.target.value)}
              />
            </Field>
          </SectionCard>
        </>
      ) : null}

      {hasBreakdown ? (
        <>
          <SectionCard title="Incident info & vehicle details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Mileage at time of issue"
                required
                hint="Numbers only."
                error={bad('mileage') && 'Enter the mileage as a number'}
              >
                <TextInput
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  placeholder="e.g. 48210"
                  value={report.mileage}
                  error={bad('mileage')}
                  onChange={(event) => setField('mileage', event.target.value.replace(/[^\d]/g, ''))}
                />
              </Field>
              <Field
                label="Exact location"
                required
                error={bad('breakdownLocation') && 'Please enter the exact location'}
              >
                <TextInput
                  placeholder="Enter the exact location"
                  value={report.breakdownLocation}
                  error={bad('breakdownLocation')}
                  onChange={(event) => setField('breakdownLocation', event.target.value)}
                />
              </Field>
            </div>

            <Field label="Dashboard warning lights details">
              <Textarea
                rows={3}
                placeholder="List any warning lights displayed and what they indicated"
                value={report.warningLights}
                onChange={(event) => setField('warningLights', event.target.value)}
              />
            </Field>

            <Field
              label="Did the vehicle stop completely?"
              required
              error={bad('vehicleStoppedCompletely') && 'Select an option'}
            >
              <RadioGroup
                name="vehicleStoppedCompletely"
                options={['Yes', 'No', 'Partially']}
                value={report.vehicleStoppedCompletely}
                error={bad('vehicleStoppedCompletely')}
                onChange={(value) => setField('vehicleStoppedCompletely', value)}
                columns={2}
              />
            </Field>
          </SectionCard>

          <SectionCard title="Action taken & outcome">
            <Field
              label="What action was taken? (Select all that apply)"
              required
              error={bad('actionTakenOutcome') && 'Select at least one action'}
            >
              <CheckboxGroup
                options={OUTCOMES}
                values={report.actionTakenOutcome}
                onToggle={(value) => toggleArrayValue('actionTakenOutcome', value)}
                error={bad('actionTakenOutcome')}
                otherOption="Other"
                otherValue={report.outcomeOther}
                onOtherChange={(value) => setField('outcomeOther', value)}
                otherPlaceholder="Please specify"
              />
            </Field>

            <Field label="Additional details">
              <Textarea
                rows={3}
                placeholder="Enter any additional details"
                value={report.breakdownOtherDetails}
                onChange={(event) => setField('breakdownOtherDetails', event.target.value)}
              />
            </Field>
          </SectionCard>
        </>
      ) : null}
    </div>
  )
}

export function validate(report) {
  const errors = []
  const push = (field, label) => errors.push({ field, label })

  if (report.incidentTypes.includes('rta')) {
    const isCollision = report.rtaEventType.some((type) => COLLISION_TYPES.includes(type))
    if (!report.rtaEventType.length) push('rtaEventType', 'Event type')
    if (report.rtaEventType.includes('Other') && !report.rtaEventTypeOther)
      push('rtaEventTypeOther', 'Event type (other) details')
    if (!report.rtaExactLocation) push('rtaExactLocation', 'Exact location')
    if (!report.rtaInjuries) push('rtaInjuries', 'Injuries')
    if (!report.allPassengersChecked) push('allPassengersChecked', 'Whether all passengers were checked')
    if (isCollision && !report.collisionDetails) push('collisionDetails', 'Collision / damage details')
  }

  if (report.incidentTypes.includes('breakdown')) {
    if (!report.mileage) push('mileage', 'Mileage at time of issue')
    else if (!/^\d+$/.test(report.mileage)) push('mileage', 'Mileage at time of issue (numbers only)')
    if (!report.breakdownLocation) push('breakdownLocation', 'Exact location (breakdown)')
    if (!report.vehicleStoppedCompletely)
      push('vehicleStoppedCompletely', 'Whether the vehicle stopped completely')
    if (!report.actionTakenOutcome.length) push('actionTakenOutcome', 'Action taken')
    if (report.actionTakenOutcome.includes('Other') && !report.outcomeOther)
      push('outcomeOther', 'Action taken (other) details')
  }

  return errors
}
