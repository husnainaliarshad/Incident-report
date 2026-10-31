import { formatDateDMY } from './dates.js'

const asText = (value) => {
  if (value == null) return ''
  if (Array.isArray(value)) return value.filter((item) => item !== null && item !== '').join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export const REPORT_COLUMNS = [
  { title: 'Full Name', type: 'SingleLineText' },
  { title: 'GDL Number', type: 'SingleLineText' },
  { title: 'Role', type: 'SingleLineText' },
  { title: 'Route Number', type: 'SingleLineText' },
  { title: 'Incident Date', type: 'SingleLineText' },
  { title: 'Journey', type: 'SingleLineText' },
  { title: 'Contact Number', type: 'SingleLineText' },
  { title: 'School Name', type: 'SingleLineText' },
  { title: 'Passengers Involved', type: 'LongText' },
  { title: 'Incident Location', type: 'SingleLineText' },
  { title: 'Location Details', type: 'LongText' },
  { title: 'Vehicle Type', type: 'SingleLineText' },
  { title: 'Vehicle Registration', type: 'SingleLineText' },
  { title: 'Wheelchair Accessible', type: 'SingleLineText' },
  { title: 'Seating Arrangement', type: 'LongText' },
  { title: 'Seating Notes', type: 'LongText' },
  { title: 'Incident Types', type: 'SingleLineText' },
  { title: 'Behaviours', type: 'LongText' },
  { title: 'Behaviour Other Details', type: 'LongText' },
  { title: 'Behaviour Injury', type: 'SingleLineText' },
  { title: 'Behaviour Injury Details', type: 'LongText' },
  { title: 'Record Method', type: 'SingleLineText' },
  { title: 'RTA Type', type: 'SingleLineText' },
  { title: 'Emergency Services', type: 'SingleLineText' },
  { title: 'Medical Attention', type: 'SingleLineText' },
  { title: 'Medical Details', type: 'LongText' },
  { title: 'Damage Types', type: 'LongText' },
  { title: 'Vehicle Unsafe', type: 'SingleLineText' },
  { title: 'Roadside Assistance', type: 'SingleLineText' },
  { title: 'Before Incident', type: 'LongText' },
  { title: 'During Incident', type: 'LongText' },
  { title: 'Actions Taken', type: 'LongText' },
  { title: 'After Incident', type: 'LongText' },
  { title: 'Anyone Injured', type: 'SingleLineText' },
  { title: 'Injured Who', type: 'LongText' },
  { title: 'Safety Equipment', type: 'SingleLineText' },
  { title: 'Other People Contacted', type: 'LongText' },
  { title: 'Anything Else', type: 'LongText' },
  { title: 'Voice Language', type: 'SingleLineText' },
  { title: 'Voice Duration (s)', type: 'Number' },
  { title: 'Voice Recording File', type: 'SingleLineText' },
  { title: 'RTA Event Type', type: 'LongText' },
  { title: 'RTA Event Type Other', type: 'LongText' },
  { title: 'RTA Location', type: 'SingleLineText' },
  { title: 'Other Vehicle Reg', type: 'SingleLineText' },
  { title: 'Other Party Details', type: 'LongText' },
  { title: 'Police Reference', type: 'SingleLineText' },
  { title: 'RTA Injuries', type: 'LongText' },
  { title: 'Road Conditions', type: 'SingleLineText' },
  { title: 'Weather Conditions', type: 'SingleLineText' },
  { title: 'Lighting Conditions', type: 'SingleLineText' },
  { title: 'Traffic Controls', type: 'SingleLineText' },
  { title: 'Direction Position', type: 'LongText' },
  { title: 'Collision Damage', type: 'LongText' },
  { title: 'Evidence Secured', type: 'SingleLineText' },
  { title: 'Witness Details', type: 'LongText' },
  { title: 'Passengers Checked', type: 'SingleLineText' },
  { title: 'Sketch Attached', type: 'SingleLineText' },
  { title: 'Additional Facts', type: 'LongText' },
  { title: 'Mileage', type: 'SingleLineText' },
  { title: 'Breakdown Location', type: 'SingleLineText' },
  { title: 'Warning Lights', type: 'LongText' },
  { title: 'Vehicle Stopped', type: 'SingleLineText' },
  { title: 'Action Taken Outcome', type: 'LongText' },
  { title: 'Outcome Other', type: 'LongText' },
  { title: 'Breakdown Details', type: 'LongText' },
]

export function flattenReport(payload = {}) {
  const basic = payload.basicInfo ?? {}
  const vehicle = basic.vehicle ?? {}
  const seating = payload.seatingArrangement ?? {}
  const categories = payload.incidentCategories ?? {}
  const behaviour = categories.behaviour ?? {}
  const rta = categories.rta ?? {}
  const damage = categories.damageOrBreakdown ?? {}
  const report = payload.behaviourReport ?? {}
  const before = report.beforeIncident ?? {}
  const during = report.duringIncident ?? {}
  const actions = report.actionsTaken ?? {}
  const after = report.afterIncident ?? {}
  const safety = report.safetyAndInjuries ?? {}
  const people = report.otherPeopleContacted ?? {}
  const voice = payload.voiceRecording ?? {}
  const rtaDetails = payload.rtaDetails ?? {}
  const parties = rtaDetails.eventAndParties ?? {}
  const conditions = rtaDetails.conditionsAndEvidence ?? {}
  const sketch = rtaDetails.sketchAndNotes ?? {}
  const breakdown = payload.breakdownDetails ?? {}
  const info = breakdown.incidentInfoAndVehicle ?? {}
  const outcome = breakdown.actionTakenAndOutcome ?? {}

  const flat = {
    'Full Name': basic.fullName,
    'GDL Number': basic.gdlNumber,
    Role: basic.role,
    'Route Number': basic.routeNumber,
    'Incident Date': formatDateDMY(basic.incidentDate),
    Journey: basic.journey,
    'Contact Number': basic.contactNumber,
    'School Name': basic.schoolName,
    'Passengers Involved': basic.passengersInvolved,
    'Incident Location': basic.incidentLocation,
    'Location Details': basic.locationDetails,
    'Vehicle Type': vehicle.type,
    'Vehicle Registration': vehicle.registration,
    'Wheelchair Accessible': vehicle.wheelchairAccessible,
    'Seating Arrangement': (seating.seats ?? [])
      .map((seat) => `${seat.seat}: ${seat.occupant}`)
      .join('; '),
    'Seating Notes': seating.additionalInformation,
    'Incident Types': categories.selected,
    Behaviours: behaviour.behaviours,
    'Behaviour Other Details': behaviour.otherDetails,
    'Behaviour Injury': behaviour.injuryOrMedicalSupport,
    'Behaviour Injury Details': behaviour.injuryDetails,
    'Record Method': behaviour.recordMethod,
    'RTA Type': rta.type === 'Other (please specify)' ? rta.otherType : rta.type,
    'Emergency Services': rta.emergencyServicesContacted,
    'Medical Attention': rta.medicalAttention,
    'Medical Details': rta.medicalDetails,
    'Damage Types': damage.issues,
    'Vehicle Unsafe': damage.vehicleUnsafe,
    'Roadside Assistance': damage.roadsideAssistance,
    'Before Incident': before.selected,
    'During Incident': during.selected,
    'Actions Taken': actions.selected,
    'After Incident': after.selected,
    'Anyone Injured': safety.anyoneInjured,
    'Injured Who': safety.injuries,
    'Safety Equipment': safety.safetyEquipment,
    'Other People Contacted': people.selected,
    'Anything Else': report.anythingElse,
    'Voice Language': voice.language,
    'Voice Duration (s)': voice.durationSeconds,
    'Voice Recording File': voice.fileName,
    'RTA Event Type': parties.eventType,
    'RTA Event Type Other': parties.eventTypeOther,
    'RTA Location': parties.exactLocation,
    'Other Vehicle Reg': parties.otherVehicleReg,
    'Other Party Details': parties.otherPartyDetails,
    'Police Reference': parties.policeReference,
    'RTA Injuries': parties.injuries,
    'Road Conditions': conditions.roadConditions,
    'Weather Conditions': conditions.weatherConditions,
    'Lighting Conditions': conditions.lightingConditions,
    'Traffic Controls': conditions.trafficControls,
    'Direction Position': conditions.directionAndVehiclePosition,
    'Collision Damage': conditions.collisionDamageDetails,
    'Evidence Secured': conditions.evidenceSecured,
    'Witness Details': conditions.witnessDetails,
    'Passengers Checked': conditions.allPassengersChecked,
    'Sketch Attached': sketch.sketchAttached,
    'Additional Facts': sketch.additionalFactualDetails,
    Mileage: info.mileage,
    'Breakdown Location': info.exactLocation,
    'Warning Lights': info.dashboardWarningLights,
    'Vehicle Stopped': info.vehicleStoppedCompletely,
    'Action Taken Outcome': outcome.actions,
    'Outcome Other': outcome.otherDetails,
    'Breakdown Details': outcome.additionalDetails,
  }

  return Object.fromEntries(
    Object.entries(flat)
      .map(([key, value]) => [key, asText(value)])
      .filter(([, value]) => value !== ''),
  )
}
