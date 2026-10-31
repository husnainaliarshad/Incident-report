export function buildSubmission(report) {
  const occupiedSeats = Object.entries(report.seats)
    .filter(([, name]) => name?.trim())
    .map(([seat, name]) => ({ seat, occupant: name.trim() }))

  return {
    meta: {
      form: 'Green Destinations Ltd – Incident Report',
      tagline: 'Safe transport • Safe people • Brighter journeys',
      submittedAt: new Date().toISOString(),
    },
    basicInfo: {
      fullName: report.fullName,
      gdlNumber: report.gdlNumber,
      role: report.role,
      routeNumber: report.routeNumber,
      incidentDate: report.incidentDate,
      journey: report.journey,
      contactNumber: report.contactNumber,
      schoolName: report.schoolName,
      passengersInvolved: report.passengerNames,
      incidentLocation: report.incidentLocations,
      locationDetails: report.locationDetails,
      vehicle: {
        type: report.vehicleType === 'Other' ? report.vehicleOther : report.vehicleType,
        registration: report.vehicleReg,
        wheelchairAccessible: report.wheelchairAccessible,
      },
    },
    seatingArrangement: {
      vehicleType: report.vehicleType,
      seats: occupiedSeats,
      unoccupiedSeatsOmitted: true,
      additionalInformation: report.seatingNotes,
    },
    incidentCategories: {
      selected: report.incidentTypes,
      behaviour: {
        behaviours: report.behaviours,
        otherDetails: report.behaviourOtherDetails,
        injuryOrMedicalSupport: report.behaviourInjury,
        injuryDetails: report.behaviourInjuryDetails,
        recordMethod: report.recordMethod,
      },
      rta: {
        type: report.rtaType,
        otherType: report.rtaTypeOther,
        emergencyServicesContacted: report.rtaEmergencyServices,
        medicalAttention: report.rtaMedicalAttention,
        medicalDetails: report.rtaMedicalDetails,
      },
      damageOrBreakdown: {
        issues: report.damageTypes,
        otherDetails: report.damageOtherDetails,
        vehicleUnsafe: report.vehicleUnsafe,
        roadsideAssistance: report.roadsideAssistance,
      },
    },
    behaviourReport: report.incidentTypes.includes('behaviour')
      ? {
          beforeIncident: { selected: report.beforeIncident, other: report.beforeIncidentOther },
          duringIncident: { selected: report.duringIncident, other: report.duringIncidentOther },
          actionsTaken: { selected: report.actionsTaken, other: report.actionsTakenOther },
          afterIncident: { selected: report.afterIncident, other: report.afterIncidentOther },
          safetyAndInjuries: {
            anyoneInjured: report.anyoneInjured,
            injuries: report.injuredWho,
            safetyEquipment: report.safetyEquipment,
          },
          otherPeopleContacted: { selected: report.otherPeople, other: report.otherPeopleOther },
          anythingElse: report.anythingElse,
        }
      : null,
    voiceRecording: report.voiceRecording
      ? {
          language: report.voiceRecording.language,
          durationSeconds: report.voiceRecording.durationSeconds,
          mimeType: report.voiceRecording.mimeType,
          recordedAt: report.voiceRecording.recordedAt,
          fileName: `voice-note.${(report.voiceRecording.mimeType || 'audio/webm').split('/')[1]}`,
          binary: report.voiceRecording.dataUrl,
        }
      : null,
    rtaDetails: report.incidentTypes.includes('rta')
      ? {
          eventAndParties: {
            eventType: report.rtaEventType,
            eventTypeOther: report.rtaEventTypeOther,
            exactLocation: report.rtaExactLocation,
            otherVehicleReg: report.rtaOtherVehicleReg,
            otherPartyDetails: report.rtaOtherPartyDetails,
            policeReference: report.rtaPoliceRef,
            injuries: report.rtaInjuries,
          },
          conditionsAndEvidence: {
            roadConditions: report.roadConditions,
            weatherConditions: report.weatherConditions,
            lightingConditions: report.lightingConditions,
            trafficControls: report.trafficControls,
            directionAndVehiclePosition: report.directionPosition,
            collisionDamageDetails: report.collisionDetails,
            evidenceSecured: report.evidenceSecured,
            witnessDetails: report.witnessDetails,
            allPassengersChecked: report.allPassengersChecked,
          },
          sketchAndNotes: {
            sketchAttached: Boolean(report.sketchDataUrl),
            sketchImage: report.sketchDataUrl,
            additionalFactualDetails: report.additionalFacts,
          },
        }
      : null,
    breakdownDetails: report.incidentTypes.includes('breakdown')
      ? {
          incidentInfoAndVehicle: {
            mileage: report.mileage,
            exactLocation: report.breakdownLocation,
            dashboardWarningLights: report.warningLights,
            vehicleStoppedCompletely: report.vehicleStoppedCompletely,
          },
          actionTakenAndOutcome: {
            actions: report.actionTakenOutcome,
            otherDetails: report.outcomeOther,
            additionalDetails: report.breakdownOtherDetails,
          },
        }
      : null,
  }
}
