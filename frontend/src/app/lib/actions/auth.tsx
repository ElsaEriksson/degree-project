"use server";
import { z } from "zod";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL;

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

    const response = await fetch(`${BACKEND_URL}/auth/register`, {
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

export const revalidateCurrentPath = async (path: string) => {
  revalidatePath(path);
};
