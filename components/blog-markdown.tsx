import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { headingId } from "@/content/articles";
import { Children, isValidElement, type ReactNode } from "react";
function text(children: ReactNode): string {
  return Children.toArray(children)
    .map((c) =>
      typeof c === "string" || typeof c === "number"
        ? String(c)
        : isValidElement<{ children: ReactNode }>(c)
          ? text(c.props.children)
          : "",
    )
    .join("");
}
export function BlogMarkdown({ body }: { body: string }) {
  let count = 0;
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      components={{
        h1: ({ children }) => <h2>{children}</h2>,
        h2: ({ children }) => (
          <h2 id={`${headingId(text(children))}-${count++}`}>{children}</h2>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        ),
      }}
    >
      {body}
    </Markdown>
  );
}
