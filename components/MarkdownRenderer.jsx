import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import BlockquoteEnhancer from './BlockquoteEnhancer'
import CodeBlock from './CodeBlock'

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

export default function MarkdownRenderer({ content }) {
  return (
    <>
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
            code({ inline, className, children, ...props }) {
              const value = String(children).replace(/\n$/, '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return <CodeBlock className={className}>{value}</CodeBlock>
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      <BlockquoteEnhancer />
    </>
  )
}
