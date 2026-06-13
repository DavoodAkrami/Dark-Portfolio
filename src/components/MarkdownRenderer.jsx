import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content, className = "", style = {} }) => {
  return (
    <div className={className} style={style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
          code: ({ inline, children }) =>
            inline ? (
              <code className="bg-[var(--button-color)] px-1.5 py-0.5 rounded text-sm">{children}</code>
            ) : (
              <pre className="bg-[var(--button-color)] p-3 rounded-ap [--ap-radius:1rem] overflow-x-auto text-sm my-2">
                <code>{children}</code>
              </pre>
            ),
          ul: ({ children }) => <ul className="list-disc pl-5 my-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 my-1">{children}</ol>,
          li: ({ children }) => <li className="my-0.5">{children}</li>,
          p: ({ children }) => <p className="my-1 last:mb-0">{children}</p>,
          h1: ({ children }) => <h1 className="text-xl font-bold my-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold my-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold my-1">{children}</h3>,
          hr: () => <hr className="my-3 border-[var(--accent-color)]/30" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
