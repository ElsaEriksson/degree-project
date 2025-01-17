import { cookies } from "next/headers";

export async function getFavoritesList(): Promise<string> {
  const cookieStore = await cookies();
  const favorites = cookieStore.get("favorites");

  if (favorites?.value) {
    return JSON.parse(favorites.value).toString();
  }

  return "";
}
