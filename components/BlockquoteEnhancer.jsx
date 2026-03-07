'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const labels = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
  error: 'Error',
  success: 'Success',
}

const icons = {
  note: 'ⓘ',
  tip: '💡',
  important: '❗',
  warning: '⚠️',
  caution: '⚠️',
  error: '⛔',
  success: '✅',
}

export default function BlockquoteEnhancer() {
  const pathname = usePathname()

  useEffect(() => {
    const blockquotes = document.querySelectorAll('.markdown-body blockquote')

    blockquotes.forEach((blockquote) => {
      if (blockquote.dataset.calloutified === 'true') {
        return
      }

      const firstParagraph = blockquote.querySelector('p')
      const firstText = firstParagraph?.textContent?.trim() || blockquote.textContent.trim()
      const match = firstText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|ERROR|SUCCESS)\]/i)

      if (!match) {
        return
      }

      const type = match[1].toLowerCase()
      blockquote.dataset.calloutified = 'true'
      blockquote.classList.add('callout', `callout--${type}`)

      if (firstParagraph) {
        firstParagraph.innerHTML = firstParagraph.innerHTML.replace(
          /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|ERROR|SUCCESS)\]\s*/i,
          ''
        )
      }

      const title = document.createElement('div')
      title.className = 'callout__title'
      title.innerHTML = `<span>${icons[type] || 'ⓘ'}</span><span>${labels[type] || type}</span>`
      blockquote.prepend(title)
    })
  }, [pathname])

  return null
}
