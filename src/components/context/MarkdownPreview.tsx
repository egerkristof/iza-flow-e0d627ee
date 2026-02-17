import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-sm prose-invert max-w-none
      [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:border-b [&_h1]:border-border/40 [&_h1]:pb-2 [&_h1]:mb-4
      [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3
      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
      [&_h4]:text-base [&_h4]:font-medium [&_h4]:mt-4 [&_h4]:mb-2
      [&_p]:my-3 [&_p]:leading-7 [&_p]:text-muted-foreground
      [&_ul]:my-3 [&_ul]:pl-6 [&_ul]:list-disc
      [&_ol]:my-3 [&_ol]:pl-6 [&_ol]:list-decimal
      [&_li]:my-1.5 [&_li]:leading-7 [&_li]:text-muted-foreground
      [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary/80
      [&_strong]:text-foreground [&_strong]:font-semibold
      [&_em]:text-foreground/80
      [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:bg-primary/5 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:rounded-r-md [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
      [&_hr]:border-border/40 [&_hr]:my-8
      [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
      [&_th]:border [&_th]:border-border/40 [&_th]:bg-secondary/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:text-foreground
      [&_td]:border [&_td]:border-border/40 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_td]:text-muted-foreground
      [&_code:not(pre_code)]:text-xs [&_code:not(pre_code)]:bg-secondary [&_code:not(pre_code)]:text-primary [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:font-mono
      [&_pre]:my-4 [&_pre]:rounded-lg [&_pre]:overflow-hidden
    ">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeStr = String(children).replace(/\n$/, "");
            if (match) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, borderRadius: "0.5rem", fontSize: "0.8rem" }}
                >
                  {codeStr}
                </SyntaxHighlighter>
              );
            }
            return <code className={className} {...props}>{children}</code>;
          },
        }}
      >
        {content || "*No content yet*"}
      </ReactMarkdown>
    </div>
  );
}
