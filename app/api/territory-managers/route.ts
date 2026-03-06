import { NextResponse } from "next/server";

// Use local JSON file for dropdowns
import dropdowns from "../../../data/dropdowns.json";

export async function GET() {
  try {
    const territoryManagers = dropdowns.territoryManagers || [];

    // Sort alphabetically by name
    territoryManagers.sort((a: any, b: any) =>
      (a.name || "").localeCompare(b.name || ""),
    );

    return NextResponse.json({
      success: true,
      data: territoryManagers.map((tm: any) => ({
        value: tm.name,
        label: tm.name,
        id: tm.id,
      })),
    });
  } catch (error) {
    console.error("Error fetching territory managers:", error);
    return NextResponse.json(
      { error: "Failed to fetch territory managers" },
      { status: 500 },
    );
  }
}
