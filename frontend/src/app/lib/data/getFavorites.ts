import { cookies } from "next/headers";

export async function getFavoritesList(): Promise<string> {
  const cookieStore = await cookies();
  const favorites = cookieStore.get("favorites");

  if (favorites?.value) {
    try {
      const parsed = JSON.parse(favorites.value);
      return Array.isArray(parsed) ? parsed.toString() : "";
    } catch {
      console.warn("Failed to parse favorites cookie");
      return "";
    }
  }

  return "";
}
