import Link from 'next/link'
import { humanizeSlugSegment } from '../lib/content'

export default function Breadcrumbs({ segments, title }) {
  const crumbs = [{ href: '/', label: 'Home' }]

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    const label = index === segments.length - 1 ? title : humanizeSlugSegment(segment)
    crumbs.push({ href, label })
  })

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumbs">
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={`${crumb.href}-${index}`}>
            {index === crumbs.length - 1 ? (
              <span>{crumb.label}</span>
            ) : (
              <Link href={crumb.href}>{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
