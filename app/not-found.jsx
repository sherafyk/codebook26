import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="empty-state">
      <h1>Page not found</h1>
      <p>
        That markdown page does not exist yet, or its file was renamed.
      </p>
      <Link href="/" className="button-link">
        Back to home
      </Link>
    </div>
  )
}
