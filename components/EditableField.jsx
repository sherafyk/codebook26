'use client'

import { useMemo, useState } from 'react'

export default function EditableField({
  initialValue = '',
  multiline = false,
  big = false,
}) {
  const [value, setValue] = useState(initialValue)

  const className = useMemo(() => {
    const classes = ['editable-field']
    if (multiline) classes.push('editable-field--multiline')
    if (big) classes.push('editable-field--big')
    return classes.join(' ')
  }, [multiline, big])

  if (multiline) {
    return (
      <textarea
        className={className}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={big ? 6 : 3}
      />
    )
  }

  return (
    <input
      className={className}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}