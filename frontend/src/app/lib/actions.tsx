"use server";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "../../../auth";
import { z } from "zod";
import { cookies } from "next/headers";
import { Cart, CartItems } from "../models/Cart";
import { Product, Variant } from "../models/Product";
import { fetchActiveCartForUser, fetchCartItem } from "./data";
import { createSession, deleteSession } from "./session";
import { redirect } from "next/navigation";
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
    await deleteSession();
  } catch (error) {
    console.error("Sign out failed:", error);
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
    const userId = user.user_id;

    await createSession(userId);
    // redirect("/");
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
  const session = await auth();

  if (session?.user?.id) {
    // Hantera inloggade användare med databas
    return await addToCartForLoggedInUser(
      Number(session.user.id),
      product,
      variant,
      quantity
    );
  } else {
    // Hantera gästanvändare med cookies
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

  // Kontrollera att cartId inte är null innan användning
  if (cartId === null) {
    throw new Error("Failed to create or fetch a cart.");
  }

  const existingCartItem = await fetchCartItem(cartId, variant.variant_id);

  if (existingCartItem) {
    await updateCartItemQuantity(
      existingCartItem.cart_item_id,
      existingCartItem.quantity + quantity
    );
  } else {
    await createCartItem(
      cartId,
      product.product_id,
      variant.variant_id,
      quantity,
      product.price
    );
  }

  return await fetchCartItem(cartId, variant.variant_id);
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
    });
  }

  cookieStore.set("cart", JSON.stringify(cart));
  return cart;
}

export async function createNewCart(
  userId: number | null
): Promise<number | null> {
  const res = await fetch("http://localhost:5000/api/carts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!res.ok) {
    throw new Error("Failed to create a new cart");
  }

  const data = await res.json();
  return data.cart_id;
}

export async function updateCartItemQuantity(
  cartItemId: number,
  newQuantity: number
): Promise<void> {
  const res = await fetch(
    `http://localhost:5000/api/cart-items/${cartItemId}`,
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
  const res = await fetch("http://localhost:5000/api/cart-items", {
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
    throw new Error("Failed to create cart item");
  }
}
