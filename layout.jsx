import './globals.css'

export const metadata = {
  title: 'LinkedIn Post Analyst — GroundAI',
  description: '5-section ghostwriter brief, tailored per client.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
