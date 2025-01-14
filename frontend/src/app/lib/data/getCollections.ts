import { Collection } from "@/app/models/Product";

const BACKEND_URL = process.env.BACKEND_URL;

export async function fetchCollections(): Promise<Collection[] | undefined> {
  try {
    const res = await fetch(`${BACKEND_URL}/collections`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Collection[] = await res.json();

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined;
  }
}
