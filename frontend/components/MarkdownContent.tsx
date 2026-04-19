"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={
        className ??
        "markdown-body max-w-none text-sm leading-relaxed text-[var(--cv-text-secondary)] [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-[var(--cv-text-primary)] [&_h2]:text-base [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-[var(--cv-border)] [&_pre]:bg-[#0d1117] [&_pre]:p-3 [&_code]:rounded [&_code]:bg-white/5 [&_code]:px-1 [&_p]:my-2"
      }
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
