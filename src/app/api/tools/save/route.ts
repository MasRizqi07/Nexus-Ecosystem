/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { dbRepo } from "@/db";
import { saveToolStateSchema } from "@/lib/validators";
import { getClientSession, attachClientCookie } from "@/lib/client-session";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const session = getClientSession(request);

    // Rate limiting: 10 saves per 60 seconds per client
    const rateCheck = checkRateLimit(`save_post_${session.clientId}`, 10, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMIT_EXCEEDED",
          message: "Too many save requests. Please wait before saving again.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.reset) },
        }
      );
    }

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
      clientId: session.clientId,
      toolType,
      title,
      stateData,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: savedState,
      },
      { status: 201 }
    );

    if (session.isNew) {
      attachClientCookie(response, session.clientId);
    }

    return response;
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
    const session = getClientSession(request);

    // Rate limiting: 30 fetches per 60 seconds per client
    const rateCheck = checkRateLimit(`save_get_${session.clientId}`, 30, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMIT_EXCEEDED",
          message: "Too many fetch requests. Please slow down.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.reset) },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");

    const validTypes = ["JSON", "REGEX", "MARKDOWN"] as const;
    const toolType = validTypes.find((t) => t === typeParam);

    // Scoped strictly to the browser client identifier
    const states = await dbRepo.getToolStates(toolType, session.clientId);

    const response = NextResponse.json({
      success: true,
      data: states,
    });

    if (session.isNew) {
      attachClientCookie(response, session.clientId);
    }

    return response;
  } catch (error: unknown) {
    console.error("Get Tool States Exception:", error);
    const message = error instanceof Error ? error.message : "Fetch failure";
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR", message },
      { status: 500 }
    );
  }
}
