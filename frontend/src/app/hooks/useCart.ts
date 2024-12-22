// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import Cookies from "js-cookie";

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

// export function useCart() {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const { data: session } = useSession();

//   useEffect(() => {
//     if (session?.user?.id) {
//       // Om användaren är inloggad, hämta varukorgen från API:et
//       fetchCartFromAPI(session.user.id);
//     } else {
//       // Om användaren inte är inloggad, hämta varukorgen från cookies
//       const cartFromCookie = JSON.parse(Cookies.get("cart") || "[]");
//       setCart(cartFromCookie);
//     }
//   }, [session]);

//   const addToCart = async (item: CartItem) => {
//     if (session?.user?.id) {
//       // Om användaren är inloggad, uppdatera varukorgen via API
//       await updateCartAPI(session.user.id, [...cart, item]);
//     } else {
//       // Om användaren inte är inloggad, uppdatera varukorgen i cookies
//       const newCart = [...cart, item];
//       setCart(newCart);
//       Cookies.set("cart", JSON.stringify(newCart), { expires: 7 });
//     }
//   };

//   const fetchCartFromAPI = async (userId: string) => {
//     try {
//       const response = await fetch(`/api/cart?userId=${userId}`);
//       const data = await response.json();
//       setCart(data);
//     } catch (error) {
//       console.error("Failed to fetch cart:", error);
//     }
//   };

//   const updateCartAPI = async (userId: string, newCart: CartItem[]) => {
//     try {
//       await fetch("/api/cart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, cart: newCart }),
//       });
//       setCart(newCart);
//     } catch (error) {
//       console.error("Failed to update cart:", error);
//     }
//   };

//   return { cart, addToCart };
// }
