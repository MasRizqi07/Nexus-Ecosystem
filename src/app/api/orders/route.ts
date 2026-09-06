import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { dbRepo } from "@/db";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "You must be logged in to view your orders." },
        { status: 401 }
      );
    }

    const orderHistory = await dbRepo.getOrdersByCustomerEmail(user.email);

    return NextResponse.json(
      {
        success: true,
        data: orderHistory,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Nexus Orders Fetch Exception:", error);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", message },
      { status: 500 }
    );
  }
}
