"use server";
import { AuthError } from "next-auth";
import { auth, signIn } from "../../auth";
import { z } from "zod";
import { cookies } from "next/headers";
import { CartItems } from "../models/Cart";
import { Product, Variant } from "../models/Product";
import { revalidatePath, revalidateTag } from "next/cache";
import { OrderData, OrderItem } from "../models/Orders";
import {
  fetchActiveCartForUser,
  fetchCartItem,
  fetchCartItemsByUserId,
} from "./data/getCarts";

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
  success?: boolean;
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const path = formData.get("path") as string;
    await signIn("credentials", formData);

    await revalidateCurrentPath(path);
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
      success: false,
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
      return {
        success: false,
        error: errorData.error || "Registration failed",
      };
    }

    const user = await response.json();
    if (user) {
      return { success: true, user };
    }
    return { success: false, message: "Registration failed" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during registration",
    };
  }
}

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
    console.log("Updating existing cart item");
    await updateCartItemQuantity(
      existingCartItem.cart_item_id,
      existingCartItem.quantity + quantity
    );
  } else {
    console.log("Creating new cart item");
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
  newQuantity: number
): Promise<void> {
  const res = await fetch(
    `http://localhost:5000/api/carts/cart-items/${cart_item_id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    }
  );

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

export const revalidateFavorites = async () => {
  revalidatePath("favorites");
};

export async function getFavorites() {
  const cookieStore = await cookies();
  const favoritesCookie = cookieStore.get("favorites");
  return favoritesCookie ? JSON.parse(favoritesCookie.value) : [];
}

export async function stripePayment(cartItems: CartItems[]) {
  const res = await fetch(
    "http://localhost:5000/payment/create-payment-intent",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create payment");
  }

  const data = await res.json();

  if (!data.clientSecret) {
    throw new Error("Server did not return a valid clientSecret");
  }

  return data.clientSecret;
}

export async function createOrder(orderData: OrderData, cart_id: number) {
  try {
    const session = await auth();
    if (session) {
      orderData.user_id = session.user.userId;
      orderData.guest_id = null;
      orderData.cart_id = cart_id;
    } else {
      orderData.guest_id = generateId();
      orderData.user_id = null;
      orderData.cart_id = null;
    }

    const response = await fetch(`http://localhost:5000/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: orderData.user_id,
        guest_id: orderData.guest_id,
        cart_id: orderData.cart_id,
        ...orderData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();

    return { success: true, orderId: data.orderId };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function createOrderItems(orderId: number, items: OrderItem[]) {
  try {
    const response = await fetch(`http://localhost:5000/order-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_id: orderId, items }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order items");
    }

    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    console.error("Error creating order items:", error);
    return { success: false, error: "Failed to create order items" };
  }
}

export async function createOrderWithItems(
  orderData: OrderData,
  items: OrderItem[],
  cart_id: number
) {
  const orderResult = await createOrder(orderData, cart_id);

  if (orderResult.success) {
    const orderItemsResult = await createOrderItems(orderResult.orderId, items);

    if (orderItemsResult.success) {
      revalidatePath("/profile");
      return {
        success: true,
        orderId: orderResult.orderId,
        message: "Order and items created successfully",
      };
    } else {
      // If order items creation fails, you might want to handle this case (e.g., delete the created order)
      return { success: false, error: orderItemsResult.error };
    }
  } else {
    return { success: false, error: orderResult.error };
  }
}

export const revalidateCurrentPath = async (path: string) => {
  revalidatePath(path);
};
