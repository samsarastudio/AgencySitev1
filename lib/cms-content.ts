import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import type { Post } from "@/payload-types";
import { getCMS } from "./cms";

export async function nativeContent(
  markdown: string,
  lexical?: Record<string, unknown>,
): Promise<Post["content"]> {
  if (lexical?.root) return lexical as Post["content"];
  const cms = await getCMS();
  const editorConfig = await editorConfigFactory.default({
    config: cms.config,
  });
  return convertMarkdownToLexical({ editorConfig, markdown });
}

export function lexicalPlainText(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const node = value as { text?: string; children?: unknown[]; root?: unknown };
  return (
    node.text ||
    (node.root
      ? lexicalPlainText(node.root)
      : (node.children || []).map(lexicalPlainText).join(" "))
  );
}
