'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

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
    const q = query.trim().toLowerCase()
    if (!q) {
      return []
    }

    return searchItems.filter((item) => {
      return [item.title, item.href, item.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q))
    })
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
                <Link key={item.href} href={item.href} className="search-result">
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
