'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export default function SearchBox({ docs = [] }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    return docs
      .map((doc) => {
        let score = 0

        if (doc.title.toLowerCase().includes(q)) score += 100
        if (doc.path.toLowerCase().includes(q)) score += 40

        const matchingHeadings = doc.headings.filter((h) =>
          h.text.toLowerCase().includes(q)
        )

        score += matchingHeadings.length * 20

        if (score === 0) return null

        return {
          ...doc,
          score,
          matchingHeadings,
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
  }, [query, docs])

  return (
    <div className="search-box">
      <input
        type="search"
        placeholder="Search titles and headings..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && results.length > 0 && (
        <div className="search-results">
          {results.map((result) => (
            <Link key={result.path} href={result.path} className="search-result">
              <div className="search-result__title">{result.title}</div>

              {result.matchingHeadings.length > 0 && (
                <div className="search-result__headings">
                  {result.matchingHeadings.slice(0, 3).map((h, i) => (
                    <div key={i} className="search-result__heading">
                      {h.text}
                    </div>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}