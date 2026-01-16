import { getBaseUrl } from "@/lib/get-base-url";

export type ProjectSEO = {
  id: number;
  title: string;
  summary: string;
  featured: boolean;
  tags: { tag: { name: string } }[];
};

export async function fetchProject(id: string): Promise<ProjectSEO | null> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(
    `${baseUrl}/api/projects/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  return res.json();
}
