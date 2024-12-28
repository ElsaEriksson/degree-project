"use server";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "../../../auth";
import { z } from "zod";
import { cookies } from "next/headers";
import { CartItems } from "../models/Cart";
import { Product, Variant } from "../models/Product";
import {
  fetchActiveCartForUser,
  fetchCartItem,
  fetchCartItemsForUser,
  fetchVariantFromDatabase,
  fetchVariantsFromDatabase,
} from "./data";
import { revalidatePath } from "next/cache";

const RegisterSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long.")
    .regex(/^[A-Za-z\s]+$/, "First name can only contain letters and spaces."),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long.")
    .regex(/^[A-Za-z\s]+$/, "Last name can only contain letters and spaces."),
  email: z.string().email("Invalid email format."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
    ),
});

export type State = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function logOut() {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Something went wrong.";
    }
  }
}

export async function register(
  prevState: State | undefined,
  formData: FormData
) {
  const validatedFields = RegisterSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Please check your registration details.",
    };
  }

  try {
    const { firstName, lastName, email, password } = validatedFields.data;

    const response = await fetch("http://localhost:5000/test/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Registration failed" };
    }

    const user = await response.json();
    return { success: true, user };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred during registration" };
  }
}

export async function addToCart(
  product: Product,
  variant: Variant,
  quantity: number = 1
) {
  // Kontrollera om varianten finns i lager
  if (variant.stock_quantity <= 0) {
    throw new Error(
      "This variant is out of stock and cannot be added to the cart."
    );
  }

  // Kontrollera om tillräckligt antal finns i lager
  if (variant.stock_quantity < quantity) {
    throw new Error(
      `Only ${variant.stock_quantity} items of this variant are available in stock.`
    );
  }

  const session = await auth();

  if (session?.user.userId) {
    return await addToCartForLoggedInUser(
      Number(session.user.userId),
      product,
      variant,
      quantity
    );
  } else {
    return await addToCartForGuestUser(product, variant, quantity);
  }
}

async function addToCartForLoggedInUser(
  userId: number,
  product: Product,
  variant: Variant,
  quantity: number
) {
  let cartId = await fetchActiveCartForUser(userId);

  if (!cartId) {
    cartId = await createNewCart(userId);
  }

  if (cartId === null) {
    throw new Error("Failed to create or fetch a cart.");
  }

  const existingCartItem = await fetchCartItem(
    cartId.cart_id,
    variant.variant_id
  );

  if (existingCartItem) {
    await updateCartItemQuantity(
      variant.variant_id,
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

  return await fetchCartItem(cartId.cart_id, variant.variant_id);
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
      product_id: product.product_id,
      variant_id: variant.variant_id,
      name: product.name,
      size: variant.size,
      quantity: quantity,
      price: product.price,
      stock_quantity: variant.stock_quantity,
    });
  }

  cookieStore.set("cart", JSON.stringify(cart));
  return cart;
}

export async function createNewCart(userId: number) {
  const res = await fetch("http://localhost:5000/api/carts", {
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
  newQuantity: number,
  variantId: number
): Promise<void> {
  const variant = await fetchVariantFromDatabase(variantId);

  // const variant = variants?.find((v) => v.variant_id === variantId);

  if (variant && variant.stock_quantity <= 0) {
    throw new Error(
      "This variant is out of stock and cannot be added to the cart."
    );
  }

  if (variant && variant.stock_quantity < newQuantity) {
    throw new Error(
      `Only ${variant.stock_quantity} items of this variant are available in stock.`
    );
  }

  const res = await fetch(
    `http://localhost:5000/api/carts/cart-items/${cart_item_id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update cart item quantity");
  }
}

export async function createCartItem(
  cartId: number,
  productId: number,
  variantId: number,
  quantity: number,
  price: number
): Promise<void> {
  const res = await fetch("http://localhost:5000/api/carts/cart-items", {
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

export async function saveCartToDatabase(userId: number, cart: CartItems[]) {
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
        item.variant_id,
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
    const res = await fetch(
      `http://localhost:5000/api/carts/cart-items/${cart_item_id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    console.log("Cart item deleted successfully");

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
    const cartItemsFromDatabase = await fetchCartItemsForUser(
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
