// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const getDbMock = vi.fn();

vi.mock("@/lib/mongodb", () => ({
  getDb: getDbMock,
}));

describe("POST /api/visits", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts document and returns success payload", async () => {
    const insertOne = vi.fn().mockResolvedValue({
      insertedId: { toString: () => "abc123" },
    });

    getDbMock.mockResolvedValue({
      collection: vi.fn().mockReturnValue({ insertOne }),
    });

    const { POST } = await import("@/app/api/visits/route");

    const req = new Request("http://localhost/api/visits", {
      method: "POST",
      body: JSON.stringify({ territoryManager: "TM 1", storeName: "Store 1" }),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ success: true, id: "abc123" });
    expect(insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        territoryManager: "TM 1",
        storeName: "Store 1",
        submittedAt: expect.any(String),
      }),
    );
  });

  it("returns 500 when db insert throws", async () => {
    getDbMock.mockRejectedValue(new Error("db down"));

    const { POST } = await import("@/app/api/visits/route");

    const req = new Request("http://localhost/api/visits", {
      method: "POST",
      body: JSON.stringify({ territoryManager: "TM 1" }),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ success: false, error: "db down" });
  });

  it("returns fallback error message for non-Error throws", async () => {
    getDbMock.mockRejectedValue("fatal");

    const { POST } = await import("@/app/api/visits/route");

    const req = new Request("http://localhost/api/visits", {
      method: "POST",
      body: JSON.stringify({ territoryManager: "TM 1" }),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ success: false, error: "Unknown error" });
  });
});
