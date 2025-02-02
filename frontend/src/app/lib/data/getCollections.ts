import { Collection } from "../definitions";

const BACKEND_URL = process.env.BACKEND_URL;

export async function fetchCollections(): Promise<Collection[] | undefined> {
  try {
    const res = await fetch(`${BACKEND_URL}/collections`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Collection[] = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching collections", error);
    return undefined;
  }
}
