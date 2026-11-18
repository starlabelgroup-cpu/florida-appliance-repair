import { useMemo, useState } from 'react'
import { Icon, Logo } from './icons'
import {
  buildBookingPayload,
  submitBooking,
  validateBooking,
  TIME_WINDOWS,
  type Attribution,
  type BookingForm as BookingFormData,
  type FieldErrors,
} from './submit'

// ─── Florida Appliance Repair — single-page landing site ────────────────────
// Operated by Top Speed Appliance. Real business facts only: no prices,
// hours, street addresses, review counts or promises appear anywhere here.
// The only contact facts are the phone number and email below.

const BRAND = 'Florida Appliance Repair'
const OPERATOR = 'Top Speed Appliance'
const SITE_URL = 'https://floridappliancerepair.com'
const PHONE_DISPLAY = '(954) 931-7997'
const PHONE_TEL = 'tel:+19549317997'
const EMAIL = 'service@topspeedappliance.net'

interface ServiceInfo {
  name: string
  icon: string
  blurb: string
}

const SERVICES: ServiceInfo[] = [
  { name: 'Refrigerator Repair', icon: 'fridge', blurb: 'Cooling, leaking, noise and ice maker faults traced methodically — temperature, airflow and defrost systems checked end to end.' },
  { name: 'Washer Repair', icon: 'washer', blurb: 'Drain, spin, leak and start faults on front-load and top-load machines, finished with a monitored test cycle.' },
  { name: 'Dryer Repair', icon: 'dryer', blurb: 'No heat, no tumble, or loads that never dry — faults across the heat circuit, the drum drive and the vent path.' },
  { name: 'Oven & Range Repair', icon: 'oven', blurb: 'Elements, igniters, sensors and controls tested so ovens heat true and burners light the way they should.' },
  { name: 'Dishwasher Repair', icon: 'dishwasher', blurb: 'Fill, wash and drain systems checked end to end for dirty dishes, standing water and leaks at the door.' },
  { name: 'Freezer & Ice Maker Repair', icon: 'freezer', blurb: 'Temperature, defrost, door-seal and ice maker water-path faults found before food quality suffers.' },
  { name: 'Microwave Repair', icon: 'microwave', blurb: 'Door switches, turntable and heating faults serviced with proper high-voltage discharge safety procedures.' },
  { name: 'Cooktop Repair', icon: 'cooktop', blurb: 'Elements, switches, igniters and glass-top controls tested burner by burner, across the full range of settings.' },
  { name: 'Garbage Disposal Repair', icon: 'disposal', blurb: 'Jams cleared safely, motors and seals tested, and the drain connection checked while everything is open.' },
  { name: 'Wine Cooler Repair', icon: 'wine', blurb: 'Temperature drift, noisy compressors and failing door seals checked zone by zone on single and dual-zone models.' },
]

const CITIES: string[] = [
  'Coral Springs',
  'Sunrise',
  'Plantation',
  'Fort Lauderdale',
  'Coconut Creek',
  'Pompano Beach',
  'Deerfield Beach',
  'Margate',
  'Tamarac',
  'Davie',
  'Weston',
  'Parkland',
  'Lauderhill',
  'Hollywood',
  'Pembroke Pines',
  'Miramar',
]

const STEPS: { title: string; text: string; icon: string }[] = [
  {
    title: 'Tell us the problem',
    icon: 'wrench',
    text: 'Send the booking form or call us and describe what the appliance is doing — noises, leaks, error codes, when it started.',
  },
  {
    title: 'We confirm by phone',
    icon: 'phone',
    text: 'A Service Setter calls you to confirm the job details and your preferred window. Pricing is confirmed at booking, before anything is dispatched.',
  },
  {
    title: 'A technician is dispatched',
    icon: 'shield',
    text: 'Once confirmed, your job is dispatched through Top Speed Service OS and the technician comes out to do the repair.',
  },
]

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How does booking work?',
    a: 'Fill out the form on this page or call (954) 931-7997. Your request goes straight into Top Speed Service OS and this page shows you a reference code for it. A Service Setter then calls the number you gave to confirm the job before a technician is dispatched.',
  },
  {
    q: 'How much does a repair cost?',
    a: 'This site does not list prices. Pricing is confirmed when you book through Service OS — the setter confirms the pricing with you by phone, before any work is scheduled.',
  },
  {
    q: 'What happens after I submit the form?',
    a: 'Your request is recorded in Top Speed Service OS and you get a reference code on screen. Keep it handy: a setter will call you to confirm the details of the job and the appointment window you picked.',
  },
  {
    q: 'Who operates Florida Appliance Repair?',
    a: 'Florida Appliance Repair is operated by Top Speed Appliance. Bookings, dispatch and service all run through Top Speed Service OS, the same system behind Top Speed Appliance.',
  },
  {
    q: 'Which areas do you cover?',
    a: 'Our Broward County service area — the sixteen cities listed on this page, including Coral Springs, Sunrise, Plantation and Fort Lauderdale — dispatched from Top Speed Appliance.',
  },
]

/** First-touch landing attribution (UTM + ad-platform click IDs),
 *  passed through to Service OS with every booking. */
function useAttribution(): Attribution {
  return useMemo(() => {
    const p = new URLSearchParams(window.location.search)
    const attribution: Attribution = {}
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'msclkid'] as const) {
      const v = p.get(k)
      if (v) attribution[k] = v
    }
    return attribution
  }, [])
}

/* ─── Booking form ────────────────────────────────────────────── */

function BookingForm() {
  const attribution = useAttribution()
  const [form, setForm] = useState<BookingFormData>({
    name: '',
    phone: '',
    zip: '',
    city: '',
    service: '',
    problem: '',
    window: TIME_WINDOWS[0],
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [state, setState] = useState<
    | { kind: 'idle' }
    | { kind: 'sending' }
    | { kind: 'failed' }
    | { kind: 'done'; reference: string }
  >({ kind: 'idle' })

  const set = (k: keyof BookingFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setForm((f) => ({ ...f, [k]: value }))
      setErrors((prev) => {
        if (!prev[k]) return prev
        const next = { ...prev }
        delete next[k]
        return next
      })
    }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateBooking(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setState({ kind: 'idle' })
      return
    }
    setErrors({})
    setState({ kind: 'sending' })
    try {
      const { reference } = await submitBooking(
        buildBookingPayload(form, attribution, window.location.pathname),
      )
      setState({ kind: 'done', reference })
    } catch {
      setState({ kind: 'failed' })
    }
  }

  if (state.kind === 'done') {
    return (
      <div className="notice notice-ok" role="status">
        <Icon name="check" size={20} />
        <p>
          <strong>Request received — reference {state.reference}.</strong><br />
          Your booking is in Top Speed Service OS. A Service Setter will call {form.phone || 'you'}
          to confirm the job details, the time window and the pricing before a technician is dispatched.
        </p>
      </div>
    )
  }

  const fieldError = (k: keyof BookingFormData) =>
    errors[k] ? (
      <span className="ferr" id={`err-${k}`} role="alert">{errors[k]}</span>
    ) : null

  return (
    <form className="booking-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <label className="f">
          Your name
          <input
            required
            value={form.name}
            onChange={set('name')}
            placeholder="Full name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'err-name' : undefined}
          />
          {fieldError('name')}
        </label>
        <label className="f">
          Phone (call/text)
          <input
            required
            value={form.phone}
            onChange={set('phone')}
            placeholder="Best number for the setter"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'err-phone' : undefined}
          />
          {fieldError('phone')}
        </label>
        <label className="f">
          ZIP code
          <input
            required
            value={form.zip}
            onChange={set('zip')}
            placeholder="e.g. 33076"
            autoComplete="postal-code"
            inputMode="numeric"
            maxLength={5}
            aria-invalid={!!errors.zip}
            aria-describedby={errors.zip ? 'err-zip' : undefined}
          />
          {fieldError('zip')}
        </label>
        <label className="f">
          City
          <select
            required
            value={form.city}
            onChange={set('city')}
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'err-city' : undefined}
          >
            <option value="">Select your city…</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {fieldError('city')}
        </label>
        <label className="f">
          Service
          <select
            required
            value={form.service}
            onChange={set('service')}
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? 'err-service' : undefined}
          >
            <option value="">Select a service…</option>
            {SERVICES.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          {fieldError('service')}
        </label>
        <label className="f">
          Preferred window
          <select
            required
            value={form.window}
            onChange={set('window')}
            aria-invalid={!!errors.window}
            aria-describedby={errors.window ? 'err-window' : undefined}
          >
            {TIME_WINDOWS.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
          {fieldError('window')}
        </label>
        <label className="f full">
          What’s the problem?
          <textarea
            required
            rows={4}
            value={form.problem}
            onChange={set('problem')}
            placeholder="Describe the symptom — noises, leaks, error codes, when it started…"
            aria-invalid={!!errors.problem}
            aria-describedby={errors.problem ? 'err-problem' : undefined}
          />
          {fieldError('problem')}
        </label>
      </div>
      {state.kind === 'failed' && (
        <div className="notice notice-err mt" role="alert">
          <Icon name="alert" size={18} />
          <p>
            Your request did not go through — nothing was submitted. Please call{' '}
            <a href={PHONE_TEL}>{PHONE_DISPLAY}</a> or email{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we will book you in directly.
          </p>
        </div>
      )}
      <button className="btn btn-coral mt" type="submit" disabled={state.kind === 'sending'}>
        <Icon name="calendar" size={17} /> {state.kind === 'sending' ? 'Sending to Service OS…' : 'Send booking request'}
      </button>
      <p className="fineprint mt-sm">
        Submitting sends your request into Top Speed Service OS. A setter confirms every booking
        by phone — nothing is dispatched from this form alone.
      </p>
    </form>
  )
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>

      <header className="site">
        <div className="header-in">
          <a className="brand" href="#top" aria-label={`${BRAND} — home`}>
            <Logo size={42} />
            <span>
              <span className="brand-name">{BRAND}</span>
              <span className="brand-sub">Operated by {OPERATOR}</span>
            </span>
          </a>
          <nav className="main" aria-label="Page sections">
            <a href="#services">Services</a>
            <a href="#how">How it works</a>
            <a href="#areas">Areas served</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="header-cta">
            <a className="btn btn-coral btn-sm" href={PHONE_TEL}>
              <Icon name="phone" size={16} /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="wrap hero-grid">
            <div>
              <span className="pill pill-light">
                <Icon name="pin" size={13} /> Broward County, Florida
              </span>
              <h1>Appliance repair in Florida, run like a system.</h1>
              <p className="lede">
                {BRAND} is operated by {OPERATOR}, based in Broward County. Every booking goes
                straight into Top Speed Service OS — a Service Setter confirms your job by phone,
                and only then is a technician dispatched.
              </p>
              <div className="hero-ctas">
                <a className="btn btn-coral" href="#book">
                  <Icon name="calendar" size={17} /> Book a repair
                </a>
                <a className="btn btn-outline-light" href={PHONE_TEL}>
                  <Icon name="phone" size={17} /> Call {PHONE_DISPLAY}
                </a>
              </div>
              <ul className="checklist hero-list">
                <li><Icon name="check" size={16} /> One form for all ten repair services</li>
                <li><Icon name="check" size={16} /> A reference code the moment your request lands in Service OS</li>
                <li><Icon name="check" size={16} /> Every booking confirmed by phone before dispatch</li>
              </ul>
            </div>
            <div className="card book-card" id="book">
              <h2>Book a repair</h2>
              <p className="book-sub">
                Send your request into Top Speed Service OS, or call{' '}
                <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>.
              </p>
              <BookingForm />
            </div>
          </div>
        </section>

        <section className="block" id="services">
          <div className="wrap">
            <div className="section-head">
              <h2>Repair services</h2>
            </div>
            <div className="grid grid-3">
              {SERVICES.map((s) => (
                <article className="card" key={s.name}>
                  <span className="icon-badge"><Icon name={s.icon} size={24} /></span>
                  <h3>{s.name}</h3>
                  <p>{s.blurb}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="block alt" id="how">
          <div className="wrap">
            <div className="section-head">
              <h2>How it works</h2>
            </div>
            <div className="grid grid-3">
              {STEPS.map((step, i) => (
                <article className="card" key={step.title}>
                  <span className="step-num" aria-hidden>{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="block" id="areas">
          <div className="wrap">
            <div className="section-head">
              <h2>Areas served</h2>
            </div>
            <p className="areas-note">
              Our Broward County service area, dispatched from {OPERATOR}.
            </p>
            <ul className="link-cloud mt">
              {CITIES.map((c) => (
                <li key={c}><span className="city-chip"><Icon name="pin" size={13} /> {c}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="block alt" id="faq">
          <div className="wrap faq-wrap">
            <div className="section-head">
              <h2>Questions, answered straight</h2>
            </div>
            <div className="stack">
              {FAQS.map((f) => (
                <details className="card faq" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <p className="fineprint mt">
              Still unsure? Call <a href={PHONE_TEL}>{PHONE_DISPLAY}</a> or email{' '}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we will point you the right way.
            </p>
          </div>
        </section>
      </main>

      <footer className="site">
        <div className="wrap footer-in">
          <div className="footer-brand">
            <span className="brand brand-footer">
              <Logo size={40} />
              <span>
                <span className="brand-name">{BRAND}</span>
                <span className="brand-sub">Operated by {OPERATOR}</span>
              </span>
            </span>
            <p>
              Appliance repair across Broward County, Florida — one booking system, Top Speed
              Service OS, behind every request.
            </p>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={PHONE_TEL}>{PHONE_DISPLAY}</a></li>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            </ul>
          </div>
          <div>
            <h4>On this page</h4>
            <ul>
              <li><a href="#services">Repair services</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#areas">Areas served</a></li>
              <li><a href="#book">Book a repair</a></li>
            </ul>
          </div>
        </div>
        <div className="wrap footer-base">
          <p>
            {BRAND} is operated by {OPERATOR}. This site’s canonical home is{' '}
            <a href={`${SITE_URL}/`}>floridappliancerepair.com</a> — bookings made here go
            directly into Top Speed Service OS.
          </p>
        </div>
      </footer>
    </>
  )
}
