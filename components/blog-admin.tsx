"use client";
import { useEffect, useRef, useState } from "react";
import type { EditablePost, BlogPost } from "@/lib/blog-model";
import { BlogMarkdown } from "./blog-markdown";
const today = () => new Date().toISOString().slice(0, 10);
const blank = (): BlogPost => ({
  slug: "",
  title: "",
  description: "",
  category: "Photo Experiences",
  author: "InMoment Team",
  published: today(),
  tags: [],
  image: "/images/ai-portrait-kiosk.webp",
  imageAlt: "InMoment photobooth concept",
  imageCaption: "Concept visualization",
  body: "",
  draft: true,
});
export function BlogAdmin() {
  const [ready, setReady] = useState(false),
    [signedIn, setSignedIn] = useState(false),
    [password, setPassword] = useState(""),
    [posts, setPosts] = useState<EditablePost[]>([]),
    [post, setPost] = useState<BlogPost | null>(null),
    [revision, setRevision] = useState<string | null>(null),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [preview, setPreview] = useState(false),
    [query, setQuery] = useState(""),
    [tagsText, setTagsText] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  async function api(url: string, options?: RequestInit) {
    const r = await fetch(url, { ...options, cache: "no-store" });
    const data = await r.json();
    if (r.status === 401) setSignedIn(false);
    if (!r.ok)
      throw new Error(data.error || "The request could not be completed.");
    return data;
  }
  async function load() {
    const data = await api("/api/admin/posts");
    setPosts(data.posts);
  }
  useEffect(() => {
    api("/api/admin/session")
      .then(async (d) => {
        setSignedIn(d.authenticated);
        if (d.authenticated) await load();
      })
      .catch((e) => setNotice(e.message))
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    const leave = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [dirty]);
  function select(next: EditablePost | null) {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    setPost(next ? { ...next } : blank());
    setRevision(next?.revision ?? null);
    setTagsText(next?.tags.join(", ") ?? "");
    setDirty(false);
    setPreview(false);
    setNotice("");
  }
  function update<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setPost((p) =>
      p
        ? {
            ...p,
            [key]: value,
            ...(key === "published"
              ? { publishedAt: String(value) + "T00:00:00.000Z" }
              : {}),
          }
        : p,
    );
    setDirty(true);
  }
  function insert(before: string, after = "") {
    const el = bodyRef.current;
    if (!el || !post) return;
    const a = el.selectionStart,
      b = el.selectionEnd;
    update(
      "body",
      post.body.slice(0, a) +
        before +
        post.body.slice(a, b) +
        after +
        post.body.slice(b),
    );
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + before.length, b + before.length);
    });
  }
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      await api("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      setSignedIn(true);
      setPassword("");
      await load();
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function save(draft: boolean) {
    if (!post) return;
    setBusy(true);
    setNotice("");
    try {
      const data = await api("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post: {
            ...post,
            tags: tagsText
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            draft,
            updated: today(),
          },
          revision,
        }),
      });
      setPost(data.post);
      setRevision(data.post.revision);
      setDirty(false);
      await load();
      setNotice(
        draft
          ? "Draft saved. This post is hidden from the public blog."
          : post.published > today()
            ? "Post saved. It will appear on its publication date (UTC)."
            : "Published. Your changes are now on the blog.",
      );
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setNotice("Choose an image under 8 MB.");
      return;
    }
    setBusy(true);
    try {
      const data = await api("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      update("image", data.url);
      setNotice(
        "Image uploaded. Add a description for accessibility, then save the post.",
      );
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const field = (
    name: keyof BlogPost,
    label: string,
    type = "text",
    required = true,
  ) => (
    <label className="field" key={name}>
      {label}
      <input
        type={type}
        required={required}
        value={String(post?.[name] ?? "")}
        disabled={name === "slug" && revision !== null}
        onChange={(e) => update(name, e.target.value)}
      />
    </label>
  );
  return (
    <div className="wrap blog-admin">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">INMOMENT / ADMIN</p>
          <h1>Blog editor</h1>
        </div>
        <a
          href="/insights"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          View the blog ↗
        </a>
      </div>
      {!ready ? (
        <p>Opening the editor…</p>
      ) : !signedIn ? (
        <form onSubmit={login} className="admin-login">
          <h2>Welcome back.</h2>
          <p>Sign in to write, edit and publish posts.</p>
          <label className="field">
            Admin password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              maxLength={256}
            />
          </label>
          <button className="button" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <>
          <div className="admin-actions">
            <button
              className="button"
              disabled={busy}
              onClick={() => select(null)}
            >
              New post +
            </button>
            <button
              className="filter"
              onClick={async () => {
                if (
                  dirty &&
                  !window.confirm("Sign out and discard unsaved changes?")
                )
                  return;
                try {
                  await api("/api/admin/session", { method: "DELETE" });
                  setSignedIn(false);
                  setPost(null);
                  setDirty(false);
                } catch (e) {
                  setNotice((e as Error).message);
                }
              }}
              disabled={busy}
            >
              Sign out
            </button>
          </div>
          <div className="admin-grid">
            <aside className="admin-posts">
              <label className="field">
                Find a post
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                />
              </label>
              {posts
                .filter((p) =>
                  (p.title + " " + p.category)
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                )
                .map((p) => (
                  <button
                    key={p.slug}
                    className={
                      "admin-post " + (post?.slug === p.slug ? "selected" : "")
                    }
                    onClick={() => select(p)}
                    disabled={busy}
                  >
                    <strong>{p.title}</strong>
                    <span>
                      {p.draft
                        ? "Draft"
                        : p.published > today()
                          ? "Scheduled"
                          : "Published"}{" "}
                      · {p.published}
                    </span>
                  </button>
                ))}
            </aside>
            {!post ? (
              <section className="admin-empty">
                <h2>What would you like to share?</h2>
                <p>
                  Choose an existing post or start a new one. Drafts stay
                  private until you publish them.
                </p>
                <p>
                  Your posts and uploaded images are saved on this server. A
                  code update does not replace them.
                </p>
              </section>
            ) : (
              <form
                className="admin-editor"
                onSubmit={(e) => {
                  e.preventDefault();
                  save(false);
                }}
              >
                <fieldset disabled={busy}>
                  <div className="admin-editor-heading">
                    <h2>{revision ? "Edit post" : "New post"}</h2>
                    <span>
                      {dirty
                        ? "Unsaved changes"
                        : post.draft
                          ? "Draft"
                          : "Published / scheduled"}
                    </span>
                  </div>
                  <div className="form-grid">
                    {field("title", "Title")}
                    {field("slug", "Post URL (lowercase-words)")}
                    {field("category", "Category")}
                    {field("author", "Author")}
                    {field(
                      "metaDescription",
                      "SEO description (max 160 characters)",
                      "text",
                      false,
                    )}
                    {field("published", "Publication date (UTC)", "date")}
                    <label className="field">
                      Tags (comma separated)
                      <input
                        value={tagsText}
                        onChange={(e) => {
                          setTagsText(e.target.value);
                          setDirty(true);
                        }}
                      />
                    </label>
                  </div>
                  <label className="field">
                    Short description / search summary
                    <textarea
                      required
                      minLength={10}
                      maxLength={320}
                      value={post.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </label>
                  <div className="admin-cover">
                    <img src={post.image} alt={post.imageAlt} />
                    <label className="field">
                      Upload cover image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          upload(e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                      <small>JPEG, PNG or WebP. Up to 8 MB.</small>
                    </label>
                  </div>
                  {field("image", "Cover image path")}
                  {field("imageAlt", "Describe the image for accessibility")}
                  {field("imageCaption", "Image caption", "text", false)}
                  <div className="admin-toolbar">
                    <button
                      type="button"
                      className="filter"
                      aria-pressed={!preview}
                      onClick={() => setPreview(false)}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      className="filter"
                      aria-pressed={preview}
                      onClick={() => setPreview(true)}
                    >
                      Preview
                    </button>
                    {!preview && (
                      <>
                        <button
                          type="button"
                          className="filter"
                          onClick={() => insert("**", "**")}
                        >
                          Bold
                        </button>
                        <button
                          type="button"
                          className="filter"
                          onClick={() => insert("\n\n## ")}
                        >
                          Heading
                        </button>
                        <button
                          type="button"
                          className="filter"
                          onClick={() => insert("\n- ")}
                        >
                          List
                        </button>
                        <button
                          type="button"
                          className="filter"
                          onClick={() => insert("[", "](https://example.com)")}
                        >
                          Link
                        </button>
                      </>
                    )}
                  </div>
                  {preview ? (
                    <article className="prose admin-preview">
                      <h2>{post.title || "Your post title"}</h2>
                      <p>{post.description}</p>
                      <BlogMarkdown body={post.body} />
                    </article>
                  ) : (
                    <label className="field">
                      Post content
                      <textarea
                        ref={bodyRef}
                        className="admin-body"
                        required
                        minLength={20}
                        maxLength={100000}
                        value={post.body}
                        onChange={(e) => update("body", e.target.value)}
                        placeholder="Start writing. Use ## for section headings, **bold**, and - for lists."
                      />
                    </label>
                  )}
                  <div className="admin-actions">
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => save(true)}
                    >
                      {post.draft ? "Save draft" : "Unpublish and save draft"}
                    </button>
                    <button className="button" type="submit">
                      {busy
                        ? "Saving…"
                        : post.published > today()
                          ? "Schedule post"
                          : revision && !post.draft
                            ? "Publish changes"
                            : "Publish post"}
                    </button>
                    {revision && !post.draft && (
                      <a
                        href={"/insights/" + post.slug}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link"
                      >
                        View published post ↗
                      </a>
                    )}
                  </div>
                  <p className="small-note">
                    Saving a published post as a draft removes it from the
                    public blog. The URL stays fixed after the first save.
                  </p>
                </fieldset>
              </form>
            )}
          </div>
        </>
      )}
      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
