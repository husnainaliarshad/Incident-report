import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const initialState = {
  // Page 1 - Basic incident information
  fullName: '',
  gdlNumber: '',
  role: '',
  routeNumber: '',
  incidentDate: '',
  journey: '',
  contactNumber: '',
  schoolName: '',
  passengerNames: '',
  incidentLocations: [],
  locationDetails: '',
  vehicleType: '',
  vehicleOther: '',
  vehicleReg: '',
  wheelchairAccessible: '',

  // Page 2 - Seating arrangement
  seats: {},
  seatingNotes: '',
  psvRowCount: 2,

  // Page 3 - Incident category details
  incidentTypes: [],
  behaviours: [],
  behaviourOtherDetails: '',
  behaviourInjury: '',
  behaviourInjuryDetails: '',
  recordMethod: '',
  rtaType: '',
  rtaTypeOther: '',
  rtaEmergencyServices: '',
  rtaMedicalAttention: '',
  rtaMedicalDetails: '',
  damageTypes: [],
  damageOtherDetails: '',
  vehicleUnsafe: '',
  roadsideAssistance: '',

  // Page 4 - Behaviour incident report (voice or written)
  beforeIncident: [],
  beforeIncidentOther: '',
  duringIncident: [],
  duringIncidentOther: '',
  actionsTaken: [],
  actionsTakenOther: '',
  afterIncident: [],
  afterIncidentOther: '',
  anyoneInjured: '',
  injuredWho: '',
  safetyEquipment: [],
  otherPeople: [],
  otherPeopleOther: '',
  anythingElse: '',

  // Voice recording
  voiceLanguage: 'English',
  voiceRecording: null,

  // Page 5 - RTA dedicated details
  rtaEventType: [],
  rtaEventTypeOther: '',
  rtaExactLocation: '',
  rtaOtherVehicleReg: '',
  rtaOtherPartyDetails: '',
  rtaPoliceRef: '',
  rtaInjuries: '',
  roadConditions: [],
  weatherConditions: [],
  lightingConditions: [],
  trafficControls: '',
  directionPosition: '',
  collisionDetails: '',
  evidenceSecured: [],
  witnessDetails: '',
  sketchDataUrl: '',
  additionalFacts: '',
  allPassengersChecked: '',

  // Page 5 - Breakdown dedicated details
  mileage: '',
  breakdownLocation: '',
  warningLights: '',
  vehicleStoppedCompletely: '',
  actionTakenOutcome: [],
  outcomeOther: '',
  breakdownOtherDetails: '',
}

const ReportContext = createContext(null)

export function ReportProvider({ children }) {
  const [report, setReport] = useState(initialState)

  const setField = useCallback((key, value) => {
    setReport((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleArrayValue = useCallback((key, value) => {
    setReport((prev) => {
      const current = prev[key] ?? []
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
  }, [])

  const toggleExclusiveValue = useCallback((key, value, exclusiveValues = []) => {
    setReport((prev) => {
      const current = prev[key] ?? []
      let next
      if (current.includes(value)) {
        next = current.filter((item) => item !== value)
      } else if (exclusiveValues.includes(value)) {
        next = [value]
      } else {
        next = [...current.filter((item) => !exclusiveValues.includes(item)), value]
      }
      return { ...prev, [key]: next }
    })
  }, [])

  const setSeat = useCallback((seatId, name) => {
    setReport((prev) => ({
      ...prev,
      seats: { ...prev.seats, [seatId]: name },
    }))
  }, [])

  const reset = useCallback(() => setReport(initialState), [])

  const value = useMemo(
    () => ({ report, setField, toggleArrayValue, toggleExclusiveValue, setSeat, reset, initialState }),
    [report, setField, toggleArrayValue, toggleExclusiveValue, setSeat, reset],
  )

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
}

export function useReport() {
  const context = useContext(ReportContext)
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider')
  }
  return context
}

export { initialState }
