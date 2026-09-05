import { NextResponse } from "next/server";
import { z } from "zod";
import { dbRepo } from "@/db";
import { createSessionToken, verifyPassword, SESSION_COOKIE_NAME } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const rawBody: unknown = await request.json();
    const result = loginSchema.safeParse(rawBody);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "VALIDATION_FAILED", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const user = await dbRepo.getUserByEmail(email);

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "INVALID_CREDENTIALS", message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "INVALID_CREDENTIALS", message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "USER" | "ADMIN",
    };

    const token = await createSessionToken(sessionUser);

    const response = NextResponse.json(
      {
        success: true,
        user: sessionUser,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", message: error instanceof Error ? error.message : "Authentication failure" },
      { status: 500 }
    );
  }
}
