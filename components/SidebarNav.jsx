'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

function tokenizeQuery(query) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((part) => part.trim())
    .filter(Boolean)
}

function scoreSearchItem(item, tokens) {
  if (!tokens.length) return 0

  const title = (item.title || '').toLowerCase()
  const description = (item.description || '').toLowerCase()
  const href = (item.href || '').toLowerCase()

  let score = 0

  for (const token of tokens) {
    const inTitle = title.includes(token)
    const inDescription = description.includes(token)
    const inHref = href.includes(token)

    if (!inTitle && !inDescription && !inHref) {
      return 0
    }

    if (title === token) score += 220
    else if (title.startsWith(token)) score += 150
    else if (inTitle) score += 100

    if (description.startsWith(token)) score += 50
    else if (inDescription) score += 35

    if (href.includes(`/${token}`) || href.includes(`#${token}`)) score += 40
    else if (inHref) score += 20
  }

  if (title.includes(tokens.join(' '))) {
    score += 80
  }

  return score
}

function isBranchActive(node, pathname) {
  if (node.type === 'page') {
    return pathname === node.href
  }

  if (node.href && pathname === node.href) {
    return true
  }

  return node.children?.some((child) => isBranchActive(child, pathname))
}

function NavTree({ nodes, pathname }) {
  return (
    <ul className="nav-list">
      {nodes.map((node) => {
        if (node.type === 'page') {
          return (
            <li key={node.href}>
              <Link
                href={node.href}
                className={`nav-link${pathname === node.href ? ' active' : ''}`}
              >
                {node.title}
              </Link>
            </li>
          )
        }

        return (
          <li key={node.key} className="nav-folder">
            <details open={isBranchActive(node, pathname) ? true : undefined}>
              <summary>{node.title}</summary>
              {node.href ? (
                <ul className="nav-list">
                  <li>
                    <Link
                      href={node.href}
                      className={`nav-link${pathname === node.href ? ' active' : ''}`}
                    >
                      Overview
                    </Link>
                  </li>
                </ul>
              ) : null}
              <NavTree nodes={node.children} pathname={pathname} />
            </details>
          </li>
        )
      })}
    </ul>
  )
}

export default function SidebarNav({ navigation, searchItems }) {
  const pathname = usePathname()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) {
      return []
    }

    const tokens = tokenizeQuery(q)

    return searchItems
      .map((item) => ({
        ...item,
        score: scoreSearchItem(item, tokens),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 20)
  }, [query, searchItems])

  return (
    <aside className="sidebar-shell">
      <div className="sidebar-inner">
        <input
          type="search"
          className="sidebar-search"
          placeholder="Search pages, snippets, guides..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <p className="sidebar-note">
          Every markdown file under <code>content/</code> becomes a page.
        </p>

        <div className="search-results" style={{ marginBottom: '1rem' }}>
          <Link href="/" className={`search-result${pathname === '/' ? ' active' : ''}`}>
            <strong>Home</strong>
            <span>/</span>
          </Link>
        </div>

        {query.trim() ? (
          <div className="search-results">
            {filtered.length ? (
              filtered.map((item) => (
                <Link key={item.key || item.href} href={item.href} className="search-result">
                  <strong>{item.title}</strong>
                  <span>{item.href}</span>
                </Link>
              ))
            ) : (
              <p className="sidebar-note">No matching pages yet.</p>
            )}
          </div>
        ) : (
          <NavTree nodes={navigation} pathname={pathname} />
        )}
      </div>
    </aside>
  )
}
