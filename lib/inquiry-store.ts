import { createHash, randomUUID } from "node:crypto";
import {
  mkdir,
  readFile,
  readdir,
  rename,
  writeFile,
  unlink,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import { inquirySchema, type Inquiry } from "./inquiry";
import { blogDirectory } from "./blog-store";
export type SavedInquiry = Omit<Inquiry, "website" | "startedAt"> & {
  id: string;
  receivedAt: string;
};
const directory = () =>
  process.env.INQUIRY_DATA_DIR
    ? resolve(/* turbopackIgnore: true */ process.env.INQUIRY_DATA_DIR)
    : join(blogDirectory(), "inquiries");
let writing = Promise.resolve();
export async function saveInquiry(input: Inquiry): Promise<SavedInquiry> {
  const { website, startedAt, ...data } = inquirySchema.parse(input);
  const id = createHash("sha256")
    .update(JSON.stringify({ startedAt, data }))
    .digest("hex");
  const operation = writing.then(async () => {
    const dir = directory();
    await mkdir(dir, { recursive: true });
    const target = join(dir, id + ".json");
    try {
      return JSON.parse(await readFile(target, "utf8")) as SavedInquiry;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    }
    const saved: SavedInquiry = {
      ...data,
      id,
      receivedAt: new Date().toISOString(),
    };
    const temp = join(dir, "." + randomUUID() + ".tmp");
    try {
      await writeFile(temp, JSON.stringify(saved, null, 2) + "\n", {
        mode: 0o600,
        flag: "wx",
      });
      await rename(temp, target);
    } finally {
      await unlink(temp).catch((e) => {
        if (e.code !== "ENOENT") throw e;
      });
    }
    return saved;
  });
  writing = operation.then(
    () => {},
    () => {},
  );
  return operation;
}
export async function listInquiries(): Promise<SavedInquiry[]> {
  let files: string[];
  try {
    files = await readdir(directory());
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
  const items = await Promise.all(
    files
      .filter((f) => /^[a-f0-9]{64}\.json$/.test(f))
      .map(
        async (f) =>
          JSON.parse(
            await readFile(join(directory(), f), "utf8"),
          ) as SavedInquiry,
      ),
  );
  return items.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
}
