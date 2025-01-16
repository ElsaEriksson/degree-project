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
): Promise<{ success: boolean; message?: string }> {
  try {
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
      return { success: result.success };
    } else {
      const result = await addToCartForGuestUser(product, variant, quantity);
      return { success: result.success };
    }
  } catch (error) {
    console.error("Error in addToCart:", error);
    return {
      success: false,
      message: "An unexpected error occurred while adding to cart.",
    };
  }
}

async function addToCartForLoggedInUser(
  userId: number,
  product: Product,
  variant: Variant,
  quantity: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const cartId = await fetchActiveCartForUser(userId);

    if (!cartId || !cartId.cart_id) {
      return { success: false, message: "Failed to fetch or create a cart." };
    }

    const existingCartItem = await fetchCartItem(
      cartId.cart_id,
      variant.variant_id
    );

    if (existingCartItem) {
      const result = await updateCartItemQuantity(
        existingCartItem.cart_item_id,
        existingCartItem.quantity + quantity
      );
      revalidateTag("cart");
      return {
        success: result.success,
      };
    } else {
      const result = await createCartItem(
        cartId.cart_id,
        product.product_id,
        variant.variant_id,
        quantity,
        product.price
      );
      revalidateTag("cart");
      return {
        success: result.success,
      };
    }
  } catch (error) {
    console.error("Error in addToCartForLoggedInUser:", error);
    return {
      success: false,
      message: "An unexpected error occurred while adding to cart.",
    };
  }
}

function generateId(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

async function addToCartForGuestUser(
  product: Product,
  variant: Variant,
  quantity: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("cart");
    const cart: CartItems[] = cartCookie ? JSON.parse(cartCookie.value) : [];

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
    return { success: true, message: "Item added to cart successfully." };
  } catch (error) {
    console.error("Error in addToCartForGuestUser:", error);
    return {
      success: false,
      message: "An unexpected error occurred while adding to cart.",
    };
  }
}

async function createNewCart(userId: number) {
  try {
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
  } catch (error) {
    console.error("Error in createNewCart:", error);
  }
}

export async function updateCartItemQuantity(
  cart_item_id: number,
  newQuantity: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/cart/cart-items/${cart_item_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message || "Failed to update cart item quantity.",
      };
    }

    const updatedItem = await res.json();
    revalidateTag("cart");
    return { success: updatedItem.success };
  } catch (error) {
    console.error("Error in updateCartItemQuantity:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred while updating cart item quantity.",
    };
  }
}

export async function updateCookieCart(
  updatedCart: CartItems[]
): Promise<{ success: boolean; message?: string }> {
  try {
    const cookieStore = await cookies();
    cookieStore.set("cart", JSON.stringify(updatedCart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return { success: true, message: "Cart updated successfully." };
  } catch (error) {
    console.error("Error in updateCookieCart:", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the cart.",
    };
  }
}

export async function createCartItem(
  cartId: number,
  productId: number,
  variantId: number,
  quantity: number,
  price: number
): Promise<{ success: boolean; message?: string }> {
  try {
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
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message || "Failed to create cart item.",
      };
    }

    const createdItem = await res.json();
    return { success: createdItem.success };
  } catch (error) {
    console.error("Error in createCartItem:", error);
    return { success: false };
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
    }
  }
}

async function saveCartToDatabase(
  userId: number,
  cart: CartItems[]
): Promise<void> {
  try {
    let cartId = await fetchActiveCartForUser(userId);

    if (!cartId) {
      cartId = await createNewCart(userId);
    }

    if (cartId === null) {
      throw new Error("Failed to create or fetch a cart.");
    }

    for (const item of cart) {
      try {
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
      } catch (error) {
        console.error(
          `Failed to save cart item (Product ID: ${item.product_id}, Variant ID: ${item.variant_id}):`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error in saveCartToDatabase:", error);
    throw new Error("Failed to save cart to database.");
  }
}

export async function removeCartItem(
  cart_item_id: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${BACKEND_URL}/cart/cart-items/${cart_item_id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message || "Failed to remove cart item.",
      };
    }

    revalidateTag("cart");
    return { success: true, message: "Cart item removed successfully." };
  } catch (error) {
    console.error("Error in removeCartItem:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred while removing the item from your cart.",
    };
  }
}

export async function getCartItems() {
  try {
    const session = await auth();

    if (session && session.user.userId) {
      const cartItemsFromDatabase = await fetchCartItemsByUserId(
        session.user.userId
      );
      return cartItemsFromDatabase || [];
    } else {
      const cookieStore = await cookies();
      const cartCookie = cookieStore.get("cart");

      if (cartCookie) {
        try {
          const cartItemsFromCookie = JSON.parse(cartCookie.value);
          return Array.isArray(cartItemsFromCookie) ? cartItemsFromCookie : [];
        } catch (error) {
          console.error("Error parsing cart cookie:", error);
          return [];
        }
      } else {
        return [];
      }
    }
  } catch (error) {
    console.error("Error in getCartItems:", error);
    throw new Error("Failed to retrieve cart items.");
  }
}
