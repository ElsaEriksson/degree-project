"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const revalidateFavorites = async () => {
  revalidatePath("favorites");
};

export async function getFavorites() {
  try {
    const cookieStore = await cookies();
    const favoritesCookie = cookieStore.get("favorites");

    if (!favoritesCookie) {
      return [];
    }

    try {
      return JSON.parse(favoritesCookie.value);
    } catch (error) {
      console.error("Failed to parse favorites cookie:", error);
      return [];
    }
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    throw new Error("Failed to retrieve favorites. Please try again later.");
  }
}

export async function getFavoritesList(): Promise<string> {
  const cookieStore = await cookies();
  const favorites = cookieStore.get("favorites");

  if (favorites?.value) {
    return JSON.parse(favorites.value).toString();
  }

  return "";
}
