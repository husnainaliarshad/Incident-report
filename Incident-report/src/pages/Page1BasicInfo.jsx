import { UserRound } from 'lucide-react'
import { useReport } from '../context/ReportContext'
import { Field, PageHeader, RadioGroup, SectionCard, TextInput, Textarea } from '../components/ui'
import { VEHICLE_TYPES, VehicleDiagram } from '../components/VehicleDiagram'
import { digitsOnly, isFutureDate, isValidIsoDate, normalisePhone, todayIso } from '../lib/dates'

const LOCATIONS = [
  'At the passenger collection point',
  'At school',
  'Inside the vehicle',
  'During the journey',
  'Other',
]

const MIN_DATE = '2000-01-01'

export default function Page1BasicInfo({ errors = [] }) {
  const { report, setField } = useReport()
  const bad = (field) => errors.some((item) => item.field === field)

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserRound}
        title="Page 1: Basic Incident Information"
        subtitle="Please provide the following information about yourself and the journey. All fields marked * are required."
      />

      <SectionCard title="Your details">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="What is your full name?"
            required
            error={bad('fullName') && 'Please enter your full name'}
          >
            <TextInput
              placeholder="Enter your full name"
              autoComplete="name"
              value={report.fullName}
              error={bad('fullName')}
              onChange={(event) => setField('fullName', event.target.value)}
            />
          </Field>
          <Field
            label="What is your GDL number?"
            required
            error={bad('gdlNumber') && 'Please enter your GDL number'}
          >
            <TextInput
              placeholder="Enter your GDL number"
              maxLength={20}
              value={report.gdlNumber}
              error={bad('gdlNumber')}
              onChange={(event) => setField('gdlNumber', event.target.value.toUpperCase())}
            />
          </Field>
          <Field label="What is your role on this journey?" required error={bad('role') && 'Select your role'}>
            <RadioGroup
              name="role"
              options={['Driver', 'Passenger Assistant']}
              value={report.role}
              error={bad('role')}
              onChange={(value) => setField('role', value)}
              columns={2}
            />
          </Field>
          <Field
            label="What is the route number?"
            required
            error={bad('routeNumber') && 'Please enter the route number'}
          >
            <TextInput
              placeholder="Enter the route number"
              maxLength={20}
              value={report.routeNumber}
              error={bad('routeNumber')}
              onChange={(event) => setField('routeNumber', event.target.value)}
            />
          </Field>
          <Field
            label="On what date did the incident occur?"
            required
            hint="You cannot select a date in the future."
            error={bad('incidentDate') && 'Please choose a valid date that is not in the future'}
          >
            <TextInput
              type="date"
              min={MIN_DATE}
              max={todayIso()}
              value={report.incidentDate}
              error={bad('incidentDate')}
              onChange={(event) => setField('incidentDate', event.target.value)}
            />
          </Field>
          <Field
            label="Which journey did the incident occur on?"
            required
            error={bad('journey') && 'Select AM or PM'}
          >
            <RadioGroup
              name="journey"
              options={['AM journey', 'PM journey']}
              value={report.journey}
              error={bad('journey')}
              onChange={(value) => setField('journey', value)}
              columns={2}
            />
          </Field>
          <Field
            label="What is your contact number?"
            required
            error={bad('contactNumber') && 'Enter a contact number with at least 7 digits'}
          >
            <TextInput
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Enter your contact number"
              value={report.contactNumber}
              error={bad('contactNumber')}
              onChange={(event) => setField('contactNumber', normalisePhone(event.target.value))}
            />
          </Field>
          <Field
            label="What is the school name?"
            required
            error={bad('schoolName') && 'Please enter the school name'}
          >
            <TextInput
              placeholder="Enter the school name"
              value={report.schoolName}
              error={bad('schoolName')}
              onChange={(event) => setField('schoolName', event.target.value)}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Incident overview">
        <Field
          label="What is the full name of the passenger(s) involved in the incident?"
          required
          hint="If more than one passenger was involved, please enter all names."
          error={bad('passengerNames') && 'Please enter the passenger name(s)'}
        >
          <Textarea
            rows={3}
            placeholder="Enter the passenger name(s)"
            value={report.passengerNames}
            error={bad('passengerNames')}
            onChange={(event) => setField('passengerNames', event.target.value)}
          />
        </Field>

        <Field
          label="Where did the incident take place?"
          required
          error={bad('incidentLocations') && 'Select where the incident took place'}
        >
          <RadioGroup
            name="incidentLocations"
            options={LOCATIONS}
            value={report.incidentLocations[0]}
            error={bad('incidentLocations')}
            onChange={(value) => setField('incidentLocations', [value])}
            columns={2}
          />
        </Field>

        {report.incidentLocations.length > 0 ? (
          <Field
            label="Please provide the location/details"
            required
            error={bad('locationDetails') && 'Please provide the location details'}
          >
            <Textarea
              rows={3}
              placeholder="Enter the location or further details"
              value={report.locationDetails}
              error={bad('locationDetails')}
              onChange={(event) => setField('locationDetails', event.target.value)}
            />
          </Field>
        ) : null}
      </SectionCard>

      <SectionCard title="Vehicle & additional info">
        <Field
          label="What type of vehicle was being used?"
          required
          error={bad('vehicleType') && 'Select the vehicle type'}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {VEHICLE_TYPES.map((vehicle) => {
              const checked = report.vehicleType === vehicle.value
              return (
                <label
                  key={vehicle.value}
                  className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition ${
                    checked
                      ? 'border-gd-700 bg-gd-50 ring-1 ring-gd-600'
                      : bad('vehicleType')
                        ? 'border-red-300 bg-white hover:border-red-400'
                        : 'border-gray-200 bg-white hover:border-gd-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="vehicleType"
                    value={vehicle.value}
                    checked={checked}
                    onChange={() => setField('vehicleType', vehicle.value)}
                    className="sr-only"
                  />
                  <VehicleDiagram type={vehicle.value} />
                  <span className="text-xs font-semibold text-gd-900">{vehicle.value}</span>
                </label>
              )
            })}
          </div>
        </Field>

        {report.vehicleType === 'Other' ? (
          <Field label="Enter vehicle type" required error={bad('vehicleOther') && 'Please enter the vehicle type'}>
            <TextInput
              placeholder="Enter vehicle type"
              value={report.vehicleOther}
              error={bad('vehicleOther')}
              onChange={(event) => setField('vehicleOther', event.target.value)}
            />
          </Field>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="What is the vehicle registration number?"
            required
            example="Example: AB12 CDE"
            error={bad('vehicleReg') && 'Enter a valid registration'}
          >
            <TextInput
              placeholder="Example: AB12 CDE"
              maxLength={10}
              autoCapitalize="characters"
              value={report.vehicleReg}
              error={bad('vehicleReg')}
              onChange={(event) =>
                setField('vehicleReg', event.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, ''))
              }
            />
          </Field>
          <Field
            label="Was the vehicle wheelchair accessible?"
            required
            error={bad('wheelchairAccessible') && 'Select an option'}
          >
            <RadioGroup
              name="wheelchairAccessible"
              options={['Yes', 'No', 'Not sure']}
              value={report.wheelchairAccessible}
              error={bad('wheelchairAccessible')}
              onChange={(value) => setField('wheelchairAccessible', value)}
              columns={2}
            />
          </Field>
        </div>
      </SectionCard>
    </div>
  )
}

export function validate(report) {
  const errors = []
  const push = (field, label) => errors.push({ field, label })

  if (!report.fullName?.trim()) push('fullName', 'Full name')
  if (!report.gdlNumber?.trim()) push('gdlNumber', 'GDL number')
  if (!report.role) push('role', 'Role on this journey')
  if (!report.routeNumber?.trim()) push('routeNumber', 'Route number')

  if (!report.incidentDate) push('incidentDate', 'Date of incident')
  else if (!isValidIsoDate(report.incidentDate)) push('incidentDate', 'Date of incident (invalid date)')
  else if (isFutureDate(report.incidentDate)) push('incidentDate', 'Date of incident (cannot be a future date)')

  if (!report.journey) push('journey', 'Journey (AM/PM)')
  if (!report.contactNumber?.trim()) push('contactNumber', 'Contact number')
  else if (digitsOnly(report.contactNumber).length < 7)
    push('contactNumber', 'Contact number (at least 7 digits)')
  if (!report.schoolName?.trim()) push('schoolName', 'School name')
  if (!report.passengerNames?.trim()) push('passengerNames', 'Passenger name(s)')
  if (!report.incidentLocations.length) push('incidentLocations', 'Where the incident took place')
  if (report.incidentLocations.length && !report.locationDetails?.trim()) {
    push('locationDetails', 'Location details')
  }
  if (!report.vehicleType) push('vehicleType', 'Vehicle type')
  if (report.vehicleType === 'Other' && !report.vehicleOther?.trim()) push('vehicleOther', 'Vehicle type (Other)')
  if (!report.vehicleReg?.trim()) push('vehicleReg', 'Vehicle registration number')
  if (!report.wheelchairAccessible) push('wheelchairAccessible', 'Vehicle wheelchair accessible')

  return errors
}
