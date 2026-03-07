import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import EditableField from './EditableField'

function ExternalAwareLink({ href = '', children, ...props }) {
  const isExternal = href.startsWith('http://') || href.startsWith('https://')

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    )
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

function cleanProps(props = {}) {
  const nextProps = { ...props }

  if ('contentEditable' in nextProps) delete nextProps.contentEditable
  if ('suppressContentEditableWarning' in nextProps) {
    delete nextProps.suppressContentEditableWarning
  }

  return nextProps
}

function childrenToText(children) {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) {
    return children
      .map((child) => {
        if (typeof child === 'string' || typeof child === 'number') {
          return String(child)
        }
        if (child && typeof child === 'object' && 'props' in child) {
          return childrenToText(child.props?.children)
        }
        return ''
      })
      .join('')
  }
  if (children && typeof children === 'object' && 'props' in children) {
    return childrenToText(children.props?.children)
  }
  return ''
}

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          a: ExternalAwareLink,

          table({ children }) {
            return (
              <div className="table-wrap">
                <table>{children}</table>
              </div>
            )
          },

          pre({ children }) {
            const child = Array.isArray(children) ? children[0] : children

            if (child && typeof child === 'object' && child.props) {
              const className = child.props.className || ''
              const code = childrenToText(child.props.children)
              return <CodeBlock className={className} code={code} />
            }

            return <pre>{children}</pre>
          },

          code({ className, children, ...props }) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },

          span({ children, className = '', ...props }) {
            const classList = className.split(/\s+/).filter(Boolean)
            const isEditable = classList.includes('editable-placeholder')
            const multiline = classList.includes('multiline')
            const big = classList.includes('big')
            const text = childrenToText(children)

            if (isEditable) {
              return (
                <EditableField
                  initialValue={text}
                  multiline={multiline}
                  big={big}
                />
              )
            }

            return (
              <span className={className} {...cleanProps(props)}>
                {children}
              </span>
            )
          },

          div({ children, className = '', ...props }) {
            return (
              <div className={className} {...cleanProps(props)}>
                {children}
              </div>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}