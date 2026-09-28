import { BlogAdmin } from "@/components/blog-admin";
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export default function Admin() {
  return <BlogAdmin />;
}
