// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { auth } from "../../../../auth";
// import { fetchCartFromDatabase } from "@/app/lib/data";

// export async function GET() {
//   const session = await auth();

//   if (session?.user?.id) {
//     // Hämta varukorgen från databasen för inloggade användare
//     const cart = await fetchCartFromDatabase(session.user.id);
//     return NextResponse.json(cart);
//   } else {
//     const cartCookies = await cookies();
//     const cart = cartCookies.get("cart")?.value;
//     return NextResponse.json(cart ? JSON.parse(cart) : []);
//   }
// }

// app/api/cart/route.ts
