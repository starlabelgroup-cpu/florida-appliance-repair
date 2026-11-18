import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

// GA4 conversion tracking: one delegated listener reports clicks on any
// tel: link as a call_click event. Guarded — a silent no-op when no
// Google tag is installed on the page.
document.addEventListener('click', (event) => {
  const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="tel:"]')
  if (!anchor) return
  if (typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', 'call_click', {
      phone_number: anchor.getAttribute('href') ?? '',
    })
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
