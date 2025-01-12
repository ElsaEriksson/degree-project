"use client";
import { getCookie, setCookie } from "cookies-next";
import { revalidateFavorites } from "@/app/lib/actions";
import { useEffect, useState } from "react";

export default function FavoriteIcon({ productId }: { productId: number }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favoritesCookie = getCookie("favorites") ?? "[]";
    const favorites = JSON.parse(favoritesCookie as string);
    setIsFavorite(favorites.includes(productId));
  }, [productId]);

  const handleToggle = () => {
    const updatedFavorites = toggleFavorite(productId);
    setIsFavorite(updatedFavorites.includes(productId));
  };

  return (
    <button
      className="bg-white rounded-full h-9 w-9 flex justify-center items-center"
      onClick={handleToggle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isFavorite ? "red" : "none"}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-heart"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}

const toggleFavorite = (productId: number) => {
  if (!productId) {
    return;
  }
  const favouritesCookie = getCookie("favorites") ?? "[]";
  const favorites = JSON.parse(favouritesCookie as string);

  const removeFavorite = favorites.find(
    (favoriteId: number) => favoriteId === productId
  );
  if (removeFavorite) {
    favorites.splice(favorites.indexOf(removeFavorite), 1);
  } else {
    favorites.push(productId);
  }
  revalidateFavorites();
  setCookie("favorites", JSON.stringify(favorites));

  return favorites;
};
