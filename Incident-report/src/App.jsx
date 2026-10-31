import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Bus, CheckCircle2, Download, RotateCcw, Send } from 'lucide-react'
import { ReportProvider, useReport } from './context/ReportContext'
import { ErrorSummary } from './components/ui'
import Page1BasicInfo, { validate as validatePage1 } from './pages/Page1BasicInfo'
import Page2Seating, { validate as validatePage2 } from './pages/Page2Seating'
import Page3IncidentDetails, { validate as validatePage3 } from './pages/Page3IncidentDetails'
import Page4BehaviourReport, { validate as validatePage4 } from './pages/Page4BehaviourReport'
import Page5DedicatedDetails, { validate as validatePage5 } from './pages/Page5DedicatedDetails'
import ReviewSubmit from './pages/ReviewSubmit'
import { buildSubmission } from './lib/submission'
import { submitReport } from './lib/nocodb'

function Header() {
  return (
    <header className="bg-gd-900 text-white shadow-md">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Bus size={24} />
          </span>
          <div>
            <p className="text-lg font-bold leading-tight tracking-tight">Green Destinations Ltd</p>
            <p className="text-xs text-gd-100/80">Safe transport • Safe people • Brighter journeys</p>
          </div>
        </div>
        <div className="sm:text-right">
          <h1 className="text-xl font-bold leading-tight">Incident Report</h1>
          <p className="text-xs text-gd-100/80">Safe transport • Safe people • Brighter journeys</p>
        </div>
      </div>
    </header>
  )
}

function StepProgress({ steps, currentStep, onJump }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((step, index) => {
        const state = index === currentStep ? 'current' : index < currentStep ? 'done' : 'todo'
        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onJump(index)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                state === 'current'
                  ? 'bg-gd-800 text-white'
                  : state === 'done'
                    ? 'bg-gd-100 text-gd-800'
                    : 'bg-white text-gray-500 ring-1 ring-gray-200'
              }`}
            >
              {index + 1}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

function SuccessModal({ onClose, onDownload, recordId }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gd-100 text-gd-800">
          <CheckCircle2 size={30} />
        </span>
        <h2 className="mt-4 text-lg font-bold text-gd-900">Report submitted</h2>
        <p className="mt-1 text-sm text-gray-600">
          Your report has been saved to the NocoDB “incident-report” table
          {recordId ? ` as record #${recordId}` : ''}. You can also download a local copy.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gd-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gd-900"
          >
            <Download size={16} /> Download JSON
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gd-600"
          >
            <RotateCcw size={16} /> Start new report
          </button>
        </div>
      </div>
    </div>
  )
}

function ReportApp() {
  const { report, reset } = useReport()
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [recordId, setRecordId] = useState(null)

  const steps = useMemo(() => {
    const list = [
      { id: 'basic', Component: Page1BasicInfo, validate: validatePage1 },
      { id: 'seating', Component: Page2Seating, validate: validatePage2 },
      { id: 'incident', Component: Page3IncidentDetails, validate: validatePage3 },
    ]
    if (report.incidentTypes.includes('behaviour')) {
      list.push({ id: 'behaviour', Component: Page4BehaviourReport, validate: validatePage4 })
    }
    if (report.incidentTypes.includes('rta') || report.incidentTypes.includes('breakdown')) {
      list.push({ id: 'dedicated', Component: Page5DedicatedDetails, validate: validatePage5 })
    }
    list.push({ id: 'review', Component: ReviewSubmit, validate: () => [] })
    return list
  }, [report.incidentTypes])

  useEffect(() => {
    setCurrentStep((step) => Math.min(step, steps.length - 1))
  }, [steps.length])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1
  const CurrentPage = steps[currentStep].Component

  const downloadSubmission = useCallback(() => {
    const payload = buildSubmission(report)
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `incident-report-${report.gdlNumber || 'draft'}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }, [report])

  const goToStep = (index) => {
    setErrors([])
    setCurrentStep(index)
  }

  const handleNext = () => {
    const pageErrors = steps[currentStep].validate(report)
    if (pageErrors.length) {
      setErrors(pageErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors([])
    setCurrentStep((step) => step + 1)
  }

  const handleSubmit = async () => {
    const pageErrors = steps[currentStep].validate(report)
    if (pageErrors.length) {
      setErrors(pageErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors([])
    setSubmitError('')
    setSubmitting(true)
    try {
      const result = await submitReport(report)
      setRecordId(result?.Id ?? null)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const startNewReport = () => {
    reset()
    setSubmitted(false)
    setSubmitting(false)
    setSubmitError('')
    setRecordId(null)
    setErrors([])
    setCurrentStep(0)
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-36 pt-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <StepProgress steps={steps} currentStep={currentStep} onJump={goToStep} />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {isLast ? 'Final step' : `Page ${currentStep + 1} of ${steps.length}`}
          </span>
        </div>

        {errors.length ? (
          <div className="mb-5">
            <ErrorSummary errors={errors} />
          </div>
        ) : null}

        {submitError ? (
          <div className="mb-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p className="font-semibold">Could not save to NocoDB</p>
            <p className="mt-0.5">{submitError}</p>
          </div>
        ) : null}

        <CurrentPage onEditPage={goToStep} errors={errors} />
      </main>

      <footer className="sticky bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => goToStep(currentStep - 1)}
            disabled={isFirst}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              isFirst
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : 'border border-gray-300 bg-white text-gray-700 hover:border-gd-600 hover:text-gd-800'
            }`}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <span className="hidden text-sm text-gray-500 sm:block">
            Step {currentStep + 1} of {steps.length}
          </span>

          {isLast ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-gd-800 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-gd-900 disabled:cursor-wait disabled:opacity-70"
            >
              <Send size={16} /> {submitting ? 'Submitting…' : 'Submit Report'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-lg bg-gd-800 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-gd-900"
            >
              Next Page <ArrowRight size={16} />
            </button>
          )}
        </div>
      </footer>

      {submitted ? (
        <SuccessModal onClose={startNewReport} onDownload={downloadSubmission} recordId={recordId} />
      ) : null}
    </div>
  )
}

export default function App() {
  return (
    <ReportProvider>
      <ReportApp />
    </ReportProvider>
  )
}
