import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { dbRepo } from "@/db";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "UNAUTHORIZED", message: "Authentication required" },
      { status: 401 }
    );
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        error: "FORBIDDEN",
        message: `Access denied. Role "${user.role}" is not permitted to access administrator resources.`,
      },
      { status: 403 }
    );
  }

  const allUsers = await dbRepo.getAllUsers();
  const products = await dbRepo.getProducts();

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        totalUsers: allUsers.length,
        totalProducts: products.length,
        systemStatus: "OPTIMAL",
        telemetryUptime: "99.999%",
      },
      users: allUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: u.createdAt,
      })),
    },
  });
}
