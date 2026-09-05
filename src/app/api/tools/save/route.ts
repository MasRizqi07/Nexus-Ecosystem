/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { dbRepo } from "@/db";
import { saveToolStateSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const rawBody: unknown = await request.json();

    const validationResult = saveToolStateSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { toolType, title, stateData } = validationResult.data;

    const savedState = await dbRepo.saveToolState({
      toolType,
      title,
      stateData,
    });

    return NextResponse.json(
      {
        success: true,
        data: savedState,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Tool State Persistence Exception:", error);
    const message = error instanceof Error ? error.message : "Persistence failure";
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");

    const validTypes = ["JSON", "REGEX", "MARKDOWN"] as const;
    const toolType = validTypes.find((t) => t === typeParam);

    const states = await dbRepo.getToolStates(toolType);

    return NextResponse.json({
      success: true,
      data: states,
    });
  } catch (error: unknown) {
    console.error("Get Tool States Exception:", error);
    const message = error instanceof Error ? error.message : "Fetch failure";
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", message },
      { status: 500 }
    );
  }
}
