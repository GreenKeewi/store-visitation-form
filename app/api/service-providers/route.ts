import { NextResponse } from "next/server";
import dropdowns from "../../../data/dropdowns.json";

export async function GET() {
  try {
    const serviceProviders = dropdowns.serviceProviders || [];

    // Sort alphabetically by name
    serviceProviders.sort((a: any, b: any) =>
      (a.name || "").localeCompare(b.name || ""),
    );

    return NextResponse.json({
      success: true,
      data: serviceProviders.map((sp: any) => ({
        value: sp.name,
        label: sp.name,
        id: sp.id,
        active: sp.active !== false,
      })),
    });
  } catch (error) {
    console.error("Error fetching service providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch service providers" },
      { status: 500 },
    );
  }
}
