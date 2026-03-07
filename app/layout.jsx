import './globals.css'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'

export const metadata = {
  title: {
    default: 'Sherafy Codebook',
    template: '%s | Sherafy Codebook',
  },
  description:
    'A fast, markdown-driven personal codebook deployed from GitHub to Vercel.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="site-header__inner">
              <Link href="/" className="site-brand">
                Sherafy Codebook
              </Link>
              <p className="site-tagline">
                Add a markdown file, commit to GitHub, and Vercel publishes the page.
              </p>
            </div>
          </header>

          <div className="app-shell">
            <Sidebar />
            <main className="main-shell">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
