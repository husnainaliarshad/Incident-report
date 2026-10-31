import { useEffect, useRef, useState } from 'react'
import { Mic, RotateCcw, Square, Trash2 } from 'lucide-react'
import { useReport } from '../context/ReportContext'

const MAX_SECONDS = 30 * 60

const LANGUAGES = [
  'English',
  'Urdu',
  'Spanish',
  'Polish',
  'Arabic',
  'Romanian',
  'Portuguese',
  'Punjabi',
  'Bengali',
  'Other',
]

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0')
  return `${minutes}:${seconds}`
}

function formatDuration(seconds) {
  return `${formatTime(seconds)} / ${formatTime(MAX_SECONDS)}`
}

export default function VoiceRecorder() {
  const { report, setField } = useReport()
  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState('')
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const elapsedRef = useRef(0)

  const recording = report.voiceRecording
  const isSupported =
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices?.getUserMedia &&
    typeof window !== 'undefined' &&
    'MediaRecorder' in window

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    recorderRef.current?.state === 'recording' && recorderRef.current.stop()
    setIsRecording(false)
    stopTracks()
  }

  const startRecording = async () => {
    setError('')
    if (!isSupported) {
      setError('Audio recording is not supported in this browser.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = () => {
          setField('voiceRecording', {
            blob,
            url: URL.createObjectURL(blob),
            dataUrl: reader.result,
            durationSeconds: elapsedRef.current,
            language: report.voiceLanguage,
            mimeType: blob.type,
            recordedAt: new Date().toISOString(),
          })
        }
        reader.readAsDataURL(blob)
      }

      recorder.start()
      recorderRef.current = recorder
      setIsRecording(true)
      setElapsed(0)
      elapsedRef.current = 0
      timerRef.current = setInterval(() => {
        elapsedRef.current += 1
        setElapsed(elapsedRef.current)
        if (elapsedRef.current >= MAX_SECONDS) stopRecording()
      }, 1000)
    } catch {
      setError('Microphone access was denied. Please allow microphone permissions and try again.')
    }
  }

  const deleteRecording = () => {
    if (recording?.url) URL.revokeObjectURL(recording.url)
    setField('voiceRecording', null)
    setElapsed(0)
    elapsedRef.current = 0
    setError('')
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-start gap-3 border-b border-gray-100 bg-red-50/60 px-5 py-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white">
          <Mic size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-red-900">Add a voice recording (optional)</h2>
          <p className="mt-0.5 text-sm text-red-900/80">
            You can also record a voice note to provide any additional information. Please speak clearly
            and include any details you were not able to add above.
          </p>
        </div>
      </header>

      <div className="space-y-5 px-5 py-5">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-800">
              Select your preferred language
            </span>
            <select
              value={report.voiceLanguage}
              onChange={(event) => setField('voiceLanguage', event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gd-600 focus:ring-2 focus:ring-gd-600/30"
            >
              {LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              aria-pressed={isRecording}
              className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition ${
                isRecording
                  ? 'animate-pulse bg-red-700 ring-4 ring-red-300'
                  : 'bg-red-600 hover:bg-red-700 hover:ring-4 hover:ring-red-200'
              }`}
            >
              {isRecording ? <Square size={30} fill="currentColor" /> : <Mic size={32} />}
            </button>
            <span className="text-xs font-medium text-gray-600">
              {isRecording ? 'Click to stop recording' : 'Click to start recording'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-900 px-4 py-3 font-mono text-lg text-white">
          <span className="text-xs font-sans uppercase tracking-wider text-gray-400">
            {isRecording ? 'Recording…' : 'Timer'}
          </span>
          <span className="tabular-nums">{formatDuration(elapsed)}</span>
          <span className="hidden text-xs font-sans text-gray-400 sm:block">Max 30 mins</span>
        </div>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

        {recording ? (
          <div className="space-y-3 rounded-lg border border-gd-100 bg-gd-50 p-4">
            <p className="text-sm font-medium text-gd-900">
              Recording ready · {formatTime(recording.durationSeconds ?? 0)} ·{' '}
              {recording.language ?? report.voiceLanguage}
            </p>
            <audio controls src={recording.url} className="w-full">
              <track kind="captions" />
            </audio>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex items-center gap-2 rounded-lg border border-gd-700 bg-white px-3.5 py-2 text-sm font-medium text-gd-800 hover:bg-gd-50"
              >
                <RotateCcw size={15} /> Re-record
              </button>
              <button
                type="button"
                onClick={deleteRecording}
                className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3.5 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
