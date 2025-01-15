"use server";
import { z } from "zod";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";

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

type RegisterResponse = {
  success: boolean;
  message: string;
};

export type State = {
  errors?: Record<string, string[]>;
  message?: string | null;
  success: boolean;
};

export async function register(
  prevState: State | undefined,
  formData: FormData
): Promise<State> {
  const validatedFields = RegisterSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors || {},
      message: "Please fix the errors in the form and try again.",
    };
  }

  const { firstName, lastName, email, password } = validatedFields.data;

  try {
    const apiResponse = await registerUser({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });

    return {
      success: apiResponse.success,
      message: apiResponse.message,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
}

async function registerUser(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  const response = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as RegisterResponse;

  if (!response.ok) {
    throw new Error(data.message || "Registration failed.");
  }

  return data;
}

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
