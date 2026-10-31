export function PageHeader({ icon: Icon, title, subtitle, badge }) {
  return (
    <div className="mb-6 border-b-2 border-gd-800 pb-5">
      <div className="flex items-start gap-4">
        {Icon ? (
          <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gd-800 text-white">
            <Icon size={22} strokeWidth={2.2} />
          </span>
        ) : null}
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-gd-900 sm:text-2xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm leading-relaxed text-gray-600">{subtitle}</p> : null}
        </div>
        {badge ? (
          <span className="ml-auto hidden shrink-0 rounded-full bg-gd-50 px-3 py-1 text-xs font-semibold text-gd-800 ring-1 ring-gd-100 sm:block">
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function InfoCallout({ children, tone = 'green', icon: Icon }) {
  const tones = {
    green: 'bg-gd-50 text-gd-900 ring-gd-100',
    amber: 'bg-amber-50 text-amber-900 ring-amber-200',
    blue: 'bg-blue-50 text-blue-900 ring-blue-200',
  }
  return (
    <div className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm ring-1 ${tones[tone]}`}>
      {Icon ? <Icon size={18} className="mt-0.5 shrink-0" /> : null}
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}

export function SectionCard({ title, subtitle, letter, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
      <header className="flex items-start gap-3 border-b border-gray-100 px-5 py-4">
        {letter ? (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gd-800 text-sm font-bold text-white">
            {letter}
          </span>
        ) : null}
        <div>
          <h2 className="text-base font-semibold text-gd-900">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p> : null}
        </div>
      </header>
      <div className="space-y-5 px-5 py-5">{children}</div>
    </section>
  )
}

export function Field({ label, required, hint, example, error, children, className = '' }) {
  return (
    <div className={className}>
      {label ? (
        <label className="mb-1.5 block text-sm font-medium text-gray-800">
          {label}
          {required ? <span className="ml-0.5 text-red-600">*</span> : null}
        </label>
      ) : null}
      {children}
      {example ? <p className="mt-1 text-xs text-gray-500">{example}</p> : null}
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  )
}

const inputBase =
  'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-gd-600/30'

export function TextInput({ error, className = '', ...props }) {
  return (
    <input
      className={`${inputBase} ${error ? 'border-red-400' : 'border-gray-300 focus:border-gd-600'} ${className}`}
      {...props}
    />
  )
}

export function Textarea({ error, maxLength, value, className = '', ...props }) {
  return (
    <div>
      <textarea
        rows={4}
        maxLength={maxLength}
        value={value}
        className={`${inputBase} resize-y ${error ? 'border-red-400' : 'border-gray-300 focus:border-gd-600'} ${className}`}
        {...props}
      />
      {maxLength ? (
        <p className="mt-1 text-right text-xs text-gray-400">
          {(value ?? '').length}/{maxLength} characters
        </p>
      ) : null}
    </div>
  )
}

export function RadioGroup({ name, options, value, onChange, columns = 1, error }) {
  return (
    <div
      className={`grid gap-2 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}
      role="radiogroup"
      aria-label={name}
    >
      {options.map((option) => {
        const opt = typeof option === 'string' ? { value: option, label: option } : option
        const checked = value === opt.value
        return (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition ${
              checked
                ? 'border-gd-700 bg-gd-50 font-medium text-gd-900 ring-1 ring-gd-600'
                : error
                  ? 'border-red-300 bg-white hover:border-red-400'
                  : 'border-gray-300 bg-white hover:border-gd-500'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => onChange(opt.value)}
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            <span>
              {opt.label}
              {opt.description ? (
                <span className="mt-0.5 block text-xs font-normal text-gray-500">{opt.description}</span>
              ) : null}
            </span>
          </label>
        )
      })}
    </div>
  )
}

export function CheckboxGroup({
  options,
  values = [],
  onToggle,
  columns = 2,
  error,
  otherValue,
  onOtherChange,
  otherOption = 'Other',
  otherPlaceholder = 'Enter details',
}) {
  return (
    <div className="space-y-2">
      <div className={`grid gap-2 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
        {options.map((option) => {
          const opt = typeof option === 'string' ? { value: option, label: option } : option
          const checked = values.includes(opt.value)
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition ${
                checked
                  ? 'border-gd-700 bg-gd-50 font-medium text-gd-900'
                  : error
                    ? 'border-red-300 bg-white hover:border-red-400'
                    : 'border-gray-300 bg-white hover:border-gd-500'
              }`}
            >
              <input
                type="checkbox"
                value={opt.value}
                checked={checked}
                onChange={() => onToggle(opt.value)}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>{opt.label}</span>
            </label>
          )
        })}
      </div>
      {onOtherChange && values.includes(otherOption) ? (
        <TextInput
          placeholder={otherPlaceholder}
          value={otherValue ?? ''}
          error={error}
          onChange={(event) => onOtherChange(event.target.value)}
        />
      ) : null}
    </div>
  )
}

export function CardRadio({ name, options, value, onChange, error }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const Icon = opt.icon
        const checked = value === opt.value
        return (
          <label
            key={opt.value}
            className={`cursor-pointer rounded-xl border-2 p-4 transition ${
              checked
                ? 'border-gd-700 bg-gd-50 ring-1 ring-gd-600'
                : error
                  ? 'border-red-300 bg-white hover:border-red-400'
                  : 'border-gray-200 bg-white hover:border-gd-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="mt-1 h-4 w-4 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 font-semibold text-gd-900">
                  {Icon ? <Icon size={18} /> : null}
                  {opt.label}
                </div>
                {opt.description ? (
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">{opt.description}</p>
                ) : null}
              </div>
            </div>
          </label>
        )
      })}
    </div>
  )
}

export function ErrorSummary({ errors }) {
  if (!errors?.length) return null
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
      <p className="font-semibold">Please complete the following required fields:</p>
      <ul className="mt-1 list-inside list-disc">
        {errors.map((item, index) => (
          <li key={`${typeof item === 'string' ? item : item.field}-${index}`}>
            {typeof item === 'string' ? item : item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
