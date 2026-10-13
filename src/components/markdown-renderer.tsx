import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";
import { slugifyHeading } from "@/lib/headings";

/**
 * MarkdownRenderer — documentation body rendering.
 *
 * Runs at build time as part of the static export, so a documentation page ships
 * as HTML with no Markdown parser in the client bundle. That is the reason the
 * docs are authored as Markdown strings rather than JSX: the content stays
 * diffable, portable, and liftable into the product repository's own `docs/`
 * tree without a translation step.
 *
 * Two deliberate restrictions:
 *
 * 1. `allowedElements` is not restricted, but raw HTML is not enabled — no
 *    `rehype-raw`. Author content comes from this repository, but a documentation
 *    pipeline that can execute arbitrary HTML in the future is a liability, and
 *    disabling it now costs nothing.
 *
 * 2. Headings receive deterministic ids from their text, so the "on this page"
 *    navigation and any deep link stay stable across builds. The ids come from
 *    the same helper the table of contents uses, which is what keeps the two in
 *    sync.
 */
export function MarkdownRenderer({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("prose-doc", className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          /**
           * Headings get an id derived from their text, plus an anchor affordance
           * that appears on hover. The anchor is a real link, so it is
           * copyable and keyboard-reachable rather than decorative.
           */
          h2({ children }) {
            const id = slugifyHeading(flatten(children));
            return (
              <h2 id={id} className="group relative">
                <AnchorLink id={id} />
                {children}
              </h2>
            );
          },
          h3({ children }) {
            const id = slugifyHeading(flatten(children));
            return (
              <h3 id={id} className="group relative">
                <AnchorLink id={id} />
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return <h4>{children}</h4>;
          },

          /**
           * Tables are the one element that genuinely overflows on narrow
           * viewports. Wrapping in a scroll container keeps the page itself from
           * scrolling horizontally — the outer page must never overflow.
           */
          table({ children }) {
            return (
              <div className="my-6 overflow-x-auto">
                <table>{children}</table>
              </div>
            );
          },

          /** Terminal output and shell commands get the one dark surface. */
          code({ className: codeClassName, children, ...rest }) {
            const isBlock = /language-/.test(codeClassName ?? "");
            if (isBlock) {
              return (
                <code className={codeClassName} {...rest}>
                  {children}
                </code>
              );
            }
            return <code {...rest}>{children}</code>;
          },

          pre({ children }) {
            return (
              <pre className="shell fact my-6 overflow-x-auto p-4 text-[0.8125rem] leading-[1.65]">
                {children}
              </pre>
            );
          },

          /** External links open in a new tab and are marked as such. */
          a({ href, children }) {
            const external = href?.startsWith("http");
            return (
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

/**
 * Hover anchor. Rendered as a real link so it can be copied or activated by
 * keyboard; visually it stays out of the way until the heading is hovered or the
 * link itself is focused.
 */
function AnchorLink({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label="Link to this section"
      className={cn(
        "absolute -left-5 top-0 hidden h-full items-center no-underline lg:flex",
        "text-rule-strong opacity-0 transition-opacity",
        "group-hover:opacity-100 focus-visible:opacity-100",
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 14 14"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M5.6 8.4a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-1 1" />
        <path d="M8.4 5.6a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l1-1" />
      </svg>
    </a>
  );
}

/**
 * Flatten React children to plain text so a heading id can be derived from it.
 * Handles the nested-array shape React uses for mixed content.
 */
function flatten(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(flatten).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    const element = node as { props?: { children?: React.ReactNode } };
    return flatten(element.props?.children);
  }
  return "";
}
