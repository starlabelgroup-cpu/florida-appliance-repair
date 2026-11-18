/**
 * Real booking submission — Top Speed Service OS Speedy booking intake.
 *
 * The booking form posts to the same public intake the Total Home
 * Appliance Repair company site's live booking form uses:
 * POST /api/v1/speedy/book. The record is persisted in Service OS
 * with a reference code, and worked by human Service Setters, who
 * confirm every booking by phone before a technician is dispatched.
 *
 * The payload shape mirrors that proven form field-for-field:
 * customer{name, phone}, city, zip, appliance (the service name),
 * issue (problem text with the appliance detail appended),
 * preferredWindow, source "WEB_FORM", via (this site's domain),
 * plus page path and first-touch ad attribution when present.
 *
 * This module is the pure payload/validation layer; App.tsx owns
 * the actual fetch through submitBooking below.
 */

export const API_BASE = 'https://top-speed-service-os.vercel.app/api/v1'

export type BookingForm = {
  name: string
  phone: string
  zip: string
  city: string
  service: string
  problem: string
  window: string
}

/** Landing-page attribution captured from the URL (first touch). */
export type Attribution = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  gclid?: string
  fbclid?: string
  msclkid?: string
}

export type BookingPayload = {
  customer: { name: string; phone: string }
  city: string
  zip: string
  appliance: string
  issue: string
  preferredWindow: string
  source: 'WEB_FORM'
  via: string
  page?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  gclid?: string
  fbclid?: string
  msclkid?: string
}

/** This site's domain, sent as the intake's `via` marker. */
export const BOOKING_VIA = 'floridappliancerepair.com'

export const TIME_WINDOWS = [
  'Today - next available',
  'Tomorrow morning (8 AM - 12 PM)',
  'Tomorrow afternoon (12 PM - 5 PM)',
  'This week - flexible',
] as const

/** Per-field validation errors, keyed by form field name. */
export type FieldErrors = Partial<Record<keyof BookingForm, string>>

/**
 * Client-side validation mirroring the company site's booking form:
 * a real name and a callable phone number (confirmation is by
 * phone), a chosen service and city, a 5-digit ZIP, and a described
 * problem. Returns one inline error per invalid field (empty object
 * when the form is valid).
 */
export function validateBooking(form: BookingForm): FieldErrors {
  const errors: FieldErrors = {}
  if (form.name.trim().length < 2) {
    errors.name = 'Please add your full name.'
  }
  if (form.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Please add a valid phone number — a setter confirms every booking by phone.'
  }
  if (!/^\d{5}$/.test(form.zip.trim())) {
    errors.zip = 'Please add your 5-digit ZIP code.'
  }
  if (!form.city) {
    errors.city = 'Please choose your city.'
  }
  if (!form.service) {
    errors.service = 'Please choose the service you need.'
  }
  if (form.problem.trim().length < 4) {
    errors.problem = 'Please briefly describe the problem.'
  }
  if (!form.window) {
    errors.window = 'Please choose a preferred time window.'
  }
  return errors
}

/**
 * Build the exact POST /speedy/book body, field-for-field the same
 * shape the Total Home company site's live form sends. Attribution
 * fields are attached only when actually captured from the URL.
 */
export function buildBookingPayload(
  form: BookingForm,
  attribution: Attribution,
  page?: string,
): BookingPayload {
  const issue = `${form.problem.trim()} (Appliance: ${form.service.trim()})`

  const payload: BookingPayload = {
    customer: { name: form.name.trim(), phone: form.phone.trim() },
    city: form.city.trim(),
    zip: form.zip.trim(),
    appliance: form.service.trim(),
    issue,
    preferredWindow: form.window,
    source: 'WEB_FORM',
    via: BOOKING_VIA,
  }
  if (page) payload.page = page.slice(0, 1000)
  if (attribution.utm_source) payload.utmSource = attribution.utm_source
  if (attribution.utm_medium) payload.utmMedium = attribution.utm_medium
  if (attribution.utm_campaign) payload.utmCampaign = attribution.utm_campaign
  if (attribution.gclid) payload.gclid = attribution.gclid
  if (attribution.fbclid) payload.fbclid = attribution.fbclid
  if (attribution.msclkid) payload.msclkid = attribution.msclkid
  return payload
}

export type SubmitResult = { reference: string }

/** POST the booking to Service OS. Resolves with the record's
 *  reference code on success; rejects on any other outcome so the
 *  UI can fall back to phone honestly. */
export async function submitBooking(payload: BookingPayload): Promise<SubmitResult> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/speedy/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Your request did not go through — nothing was submitted.')
  }
  const body = await res.json().catch(() => null)
  const reference = body?.data?.referenceCode
  if (!res.ok || !reference) {
    throw new Error(body?.error || 'Your request did not go through — nothing was submitted.')
  }
  return { reference: String(reference) }
}
