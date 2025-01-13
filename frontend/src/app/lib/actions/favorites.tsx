"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const revalidateFavorites = async () => {
  revalidatePath("favorites");
};

export async function getFavorites() {
  const cookieStore = await cookies();
  const favoritesCookie = cookieStore.get("favorites");
  return favoritesCookie ? JSON.parse(favoritesCookie.value) : [];
}
