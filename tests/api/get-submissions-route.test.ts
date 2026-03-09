// @vitest-environment node

import fs from "fs/promises";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("fs/promises", () => ({
  default: {
    readFile: vi.fn(),
  },
}));

describe("GET /api/get-submissions", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("falls back to file storage and returns submissions sorted by date", async () => {
    vi.stubEnv("USE_MONGO", "false");

    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify([
        { id: "old", submittedAt: "2024-01-01T00:00:00.000Z" },
        { id: "new", submittedAt: "2024-02-01T00:00:00.000Z" },
      ]) as never,
    );

    const { GET } = await import("@/app/api/get-submissions/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.count).toBe(2);
    expect(body.data[0].id).toBe("new");
    expect(body.data[1].id).toBe("old");
    expect(body.message).toContain("file");
  });

  it("returns empty list when file does not exist", async () => {
    vi.stubEnv("USE_MONGO", "false");
    vi.mocked(fs.readFile).mockRejectedValue(new Error("ENOENT"));

    const { GET } = await import("@/app/api/get-submissions/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: [],
      count: 0,
      message: "No submissions found",
    });
  });

  it("returns empty list when file content is invalid JSON", async () => {
    vi.stubEnv("USE_MONGO", "false");
    vi.mocked(fs.readFile).mockResolvedValue("not-json" as never);

    const { GET } = await import("@/app/api/get-submissions/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
    expect(body.count).toBe(0);
  });

  it("limits file-based responses to 100 records", async () => {
    vi.stubEnv("USE_MONGO", "false");
    const records = Array.from({ length: 120 }, (_, index) => ({
      id: `id-${index}`,
      submittedAt: `2024-01-${String((index % 28) + 1).padStart(2, "0")}T00:00:00.000Z`,
    }));
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(records) as never);

    const { GET } = await import("@/app/api/get-submissions/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.count).toBe(120);
    expect(body.data).toHaveLength(100);
  });
});
