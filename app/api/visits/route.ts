import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // store entire payload as-is and add submittedAt
    const doc = {
      ...body,
      submittedAt: new Date().toISOString(),
    };

    const db = await getDb();
    const collection = db.collection("visitations");

    const result = await collection.insertOne(doc);

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
    });
  } catch (err: any) {
    console.error("/api/visits error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 },
    );
  }
}
