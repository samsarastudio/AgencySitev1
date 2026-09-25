import { unified } from "unified";
import remarkParse from "remark-parse";
type Ast = {
  type: string;
  value?: string;
  depth?: number;
  ordered?: boolean;
  start?: number;
  url?: string;
  alt?: string;
  lang?: string;
  children?: Ast[];
};
type Lex = Record<string, unknown> & { type: string; children?: Lex[] };
const element = (
  type: string,
  children: Lex[],
  extra: Record<string, unknown> = {},
): Lex => ({
  type,
  children,
  direction: null,
  format: "",
  indent: 0,
  version: 1,
  ...extra,
});
const leaf = (text: string, format = 0): Lex => ({
  type: "text",
  text,
  format,
  detail: 0,
  mode: "normal",
  style: "",
  version: 1,
});
export function markdownToLexical(markdown: string) {
  const ast = unified().use(remarkParse).parse(markdown) as Ast;
  function convert(n: Ast, format = 0): Lex[] {
    const children = () => n.children?.flatMap((c) => convert(c, format)) || [];
    switch (n.type) {
      case "root":
        return [element("root", children())];
      case "text":
        return [leaf(n.value || "", format)];
      case "strong":
        return n.children!.flatMap((c) => convert(c, format | 1));
      case "emphasis":
        return n.children!.flatMap((c) => convert(c, format | 2));
      case "inlineCode":
        return [leaf(n.value || "", format | 16)];
      case "paragraph":
        return [
          element("paragraph", children(), { textFormat: 0, textStyle: "" }),
        ];
      case "heading":
        return [element("heading", children(), { tag: "h" + n.depth })];
      case "blockquote":
        return [element("quote", children())];
      case "list":
        return [
          element("list", children(), {
            listType: n.ordered ? "number" : "bullet",
            tag: n.ordered ? "ol" : "ul",
            start: n.start || 1,
          }),
        ];
      case "listItem":
        return [element("listitem", children(), { value: 1 })];
      case "link":
        return [
          element("link", children(), {
            fields: { url: n.url, linkType: "custom", newTab: false },
          }),
        ];
      case "break":
        return [{ type: "linebreak", version: 1 }];
      case "thematicBreak":
        return [{ type: "horizontalrule", version: 1 }];
      case "code":
        return [
          element("code", [leaf(n.value || "")], { language: n.lang || "" }),
        ];
      case "image":
        return [
          element("link", [leaf(n.alt || "Image")], {
            fields: { url: n.url, linkType: "custom", newTab: false },
          }),
        ];
      case "html":
        return [leaf(n.value || "")];
      default:
        throw new Error("Unsupported Markdown node: " + n.type);
    }
  }
  return { root: convert(ast)[0] };
}
export function lexicalToMarkdown(input: unknown): string {
  let nodes = 0;
  const escape = (s: string) => s.replace(/[\\`*_{}\[\]<>]/g, "\\$&");
  function node(value: unknown, depth = 0): string {
    if (depth > 40 || ++nodes > 10000 || !value || typeof value !== "object")
      throw new Error("Invalid rich text tree");
    const n = value as Record<string, unknown>;
    const type = n.type;
    const kids = () => {
      if (!Array.isArray(n.children))
        throw new Error("Missing rich text children");
      return n.children.map((c) => node(c, depth + 1));
    };
    const inline = () => kids().join("");
    switch (type) {
      case "root":
        return kids().join("\n\n");
      case "paragraph":
        return inline();
      case "heading": {
        if (!/^h[1-6]$/.test(String(n.tag))) throw new Error("Invalid heading");
        return "#".repeat(Number(String(n.tag)[1])) + " " + inline();
      }
      case "text": {
        if (typeof n.text !== "string") throw new Error("Invalid text");
        const f = Number(n.format) || 0;
        let s = escape(n.text);
        if (f & 16) s = "`" + n.text.replace(/`/g, "\\`") + "`";
        if (f & 1) s = "**" + s + "**";
        if (f & 2) s = "*" + s + "*";
        if (f & 4) s = "~~" + s + "~~";
        return s;
      }
      case "linebreak":
        return "  \n";
      case "quote":
        return kids()
          .join("\n\n")
          .split("\n")
          .map((l) => "> " + l)
          .join("\n");
      case "list":
        return kids()
          .map(
            (s, i) =>
              (n.listType === "number" ? i + 1 + ". " : "- ") +
              s.replace(/\n/g, "\n  "),
          )
          .join("\n");
      case "listitem":
        return kids().join("\n");
      case "link":
      case "autolink": {
        const fields = n.fields as Record<string, unknown> | undefined;
        const url = String(fields?.url || n.url || "");
        if (!/^(https?:\/\/|mailto:|\/(?!\/)|#)/.test(url))
          throw new Error("Only safe URLs are supported");
        return (
          "[" +
          inline() +
          "](" +
          url.replace(/[()\s]/g, (c) => encodeURIComponent(c)) +
          ")"
        );
      }
      case "horizontalrule":
        return "---";
      case "code":
        return (
          "```" +
          String(n.language || "").replace(/[^\w+-]/g, "") +
          "\n" +
          kids().join("") +
          "\n```"
        );
      default:
        throw new Error(
          "Unsupported Lexical node: " +
            String(type) +
            ". Send Markdown in content for this post.",
        );
    }
  }
  const root = (input as { root?: unknown })?.root;
  if ((root as { type?: string })?.type !== "root")
    throw new Error("contentLexical requires a root node");
  return node(root);
}
