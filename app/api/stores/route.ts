import { NextResponse } from "next/server";
import dropdowns from "../../../data/dropdowns.json";

export async function GET() {
  try {
    const stores = dropdowns.stores || [];

    // Sort alphabetically by name
    stores.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));

    return NextResponse.json({
      success: true,
      data: stores.map((store: any) => ({
        value: store.name,
        label: `${store.name} - ${store.number}`,
        id: store.id,
        number: store.number,
      })),
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 },
    );
  }
}
