"use server";
import { revalidateTag } from "next/cache";
import {
  fetchActiveCartForUser,
  fetchCartItem,
  fetchCartItemsByUserId,
} from "../data/getCarts";
import { auth } from "../../../auth";
import { cookies } from "next/headers";
import { CartItems, Product, Variant } from "../definitions";

const BACKEND_URL = process.env.BACKEND_URL;

export async function addToCart(
  product: Product,
  variant: Variant,
  quantity: number
) {
  if (variant.stock_quantity <= 0) {
    throw new Error(
      "This variant is out of stock and cannot be added to the cart."
    );
  }

  if (variant.stock_quantity < quantity) {
    throw new Error(
      `Only ${variant.stock_quantity} items of this variant are available in stock.`
    );
  }

  const session = await auth();

  if (session?.user.userId) {
    const result = await addToCartForLoggedInUser(
      Number(session.user.userId),
      product,
      variant,
      quantity
    );
    return { success: true, data: result };
  } else {
    const result = await addToCartForGuestUser(product, variant, quantity);
    return { success: true, data: result };
  }
}

async function addToCartForLoggedInUser(
  userId: number,
  product: Product,
  variant: Variant,
  quantity: number
) {
  const cartId = await fetchActiveCartForUser(userId);

  if (!cartId || !cartId.cart_id) {
    throw new Error("Failed to fetch or create a cart.");
  }

  const existingCartItem = await fetchCartItem(
    cartId.cart_id,
    variant.variant_id
  );

  if (existingCartItem) {
    await updateCartItemQuantity(
      existingCartItem.cart_item_id,
      existingCartItem.quantity + quantity
    );
  } else {
    await createCartItem(
      cartId.cart_id,
      product.product_id,
      variant.variant_id,
      quantity,
      product.price
    );
  }

  revalidateTag("cart");
  return await fetchCartItem(cartId.cart_id, variant.variant_id);
}

function generateId(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

async function addToCartForGuestUser(
  product: Product,
  variant: Variant,
  quantity: number
) {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart");
  let cart: CartItems[] = cartCookie ? JSON.parse(cartCookie.value) : [];

  const existingItemIndex = cart.findIndex(
    (item) => item.variant_id === variant.variant_id
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      cart_item_id: generateId(),
      cart_id: generateId(),
      product_id: product.product_id,
      variant_id: variant.variant_id,
      name: product.name,
      size: variant.size,
      quantity: quantity,
      price: product.price,
      stock_quantity: variant.stock_quantity,
      main_image: product.main_image,
    });
  }

  cookieStore.set("cart", JSON.stringify(cart));
  return cart;
}

async function createNewCart(userId: number) {
  const res = await fetch(`${BACKEND_URL}/cart/create-cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!res.ok) {
    throw new Error("Failed to create a new cart");
  }

  const data = await res.json();

  if (!data.cart_id) {
    throw new Error("Server did not return a valid cart_id");
  }

  return data.cart_id;
}

export async function updateCartItemQuantity(
  cart_item_id: number,
  newQuantity: number
): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/cart/cart-items/${cart_item_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity: newQuantity }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Failed to update cart item quantity: ${
        errorData.error || errorData.message || res.statusText
      }`
    );
  }

  revalidateTag("cart");
}

export async function updateCookieCart(updatedCart: CartItems[]) {
  const cookieStore = await cookies();
  cookieStore.set("cart", JSON.stringify(updatedCart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return { success: true };
}

export async function createCartItem(
  cartId: number,
  productId: number,
  variantId: number,
  quantity: number,
  price: number
): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/cart/cart-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cart_id: cartId,
      product_id: productId,
      variant_id: variantId,
      quantity,
      price,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Server response:", res.status, errorBody);
    throw new Error(`Failed to create cart item: ${res.status} ${errorBody}`);
  }
}

export async function migrateCartFromCookiesToDatabase(userId: number) {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart");

  if (cartCookie) {
    try {
      const cart = JSON.parse(cartCookie.value);
      await saveCartToDatabase(userId, cart);
      cookieStore.delete("cart");
    } catch (error) {
      console.error("Failed to migrate cart:", error);
      // Här kan du välja att behålla cookie-varukorgen om migreringen misslyckas
    }
  }
}

async function saveCartToDatabase(userId: number, cart: CartItems[]) {
  let cartId = await fetchActiveCartForUser(userId);

  if (!cartId) {
    cartId = await createNewCart(userId);
  }

  if (cartId === null) {
    throw new Error("Failed to create or fetch a cart.");
  }

  for (const item of cart) {
    const existingCartItem = await fetchCartItem(
      cartId.cart_id,
      item.variant_id
    );

    if (existingCartItem) {
      await updateCartItemQuantity(
        existingCartItem.cart_item_id,
        existingCartItem.quantity + item.quantity
      );
    } else {
      await createCartItem(
        cartId.cart_id,
        item.product_id,
        item.variant_id,
        item.quantity,
        item.price
      );
    }
  }
}

export async function removeCartItem(cart_item_id: number) {
  try {
    const res = await fetch(`${BACKEND_URL}/cart/cart-items/${cart_item_id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log("Cart item deleted successfully");

    revalidateTag("cart");

    return { success: true };
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return {
      success: false,
      message:
        "Could not remove the item from your cart. Please try again later.",
    };
  }
}

export async function getCartItems() {
  const session = await auth();

  if (session !== null && session.user.userId) {
    const cartItemsFromDatabase = await fetchCartItemsByUserId(
      session.user.userId
    );
    if (cartItemsFromDatabase) {
      return cartItemsFromDatabase;
    }
  } else {
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("cart");
    const cartItemsFromCookie = cartCookie ? JSON.parse(cartCookie.value) : [];
    return cartItemsFromCookie;
  }
}
