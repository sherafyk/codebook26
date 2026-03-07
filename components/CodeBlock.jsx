'use client'

import { useState } from 'react'

export default function CodeBlock({ code = '', className = '' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code-block">
      <button type="button" className="code-block__button" onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre>
        <code className={className}>{code}</code>
      </pre>
    </div>
  )
}