// @vitest-environment node

import fs from "fs/promises";
import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("fs/promises", () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  },
}));

describe("POST /api/submit-form", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("MONGODB_URI", "mongodb+srv://user:pw@cluster/store-visits");
    vi.stubEnv("USE_MONGO", "false");
  });

  it("returns 400 for missing required fields", async () => {
    const { POST } = await import("@/app/api/submit-form/route");

    const req = new Request("http://localhost/api/submit-form", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "1.1.1.1",
      },
      body: JSON.stringify({ territoryManager: "TM" }),
    });

    const res = await POST(req as unknown as NextRequest);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toContain("required");
  });

  it("returns 500 when MONGODB_URI is missing", async () => {
    vi.stubEnv("MONGODB_URI", "");
    const { POST } = await import("@/app/api/submit-form/route");

    const req = new Request("http://localhost/api/submit-form", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        territoryManager: "TM",
        storeName: "Store",
        serviceProvider: "SP",
      }),
    });

    const res = await POST(req as unknown as NextRequest);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toContain("Database configuration");
  });

  it("stores submission in local file fallback and returns success", async () => {
    vi.mocked(fs.mkdir).mockResolvedValue(undefined as never);
    vi.mocked(fs.readFile).mockResolvedValue("[]" as never);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined as never);

    const { POST } = await import("@/app/api/submit-form/route");

    const req = new Request("http://localhost/api/submit-form", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "2.2.2.2",
        "user-agent": "vitest",
      },
      body: JSON.stringify({
        territoryManager: "TM",
        storeName: "Store",
        serviceProvider: "SP",
      }),
    });

    const res = await POST(req as unknown as NextRequest);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toContain("file");
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
  });

  it("enforces IP rate limiting", async () => {
    vi.mocked(fs.mkdir).mockResolvedValue(undefined as never);
    vi.mocked(fs.readFile).mockResolvedValue("[]" as never);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined as never);

    const { POST } = await import("@/app/api/submit-form/route");

    const makeReq = () =>
      new Request("http://localhost/api/submit-form", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "9.9.9.9",
        },
        body: JSON.stringify({
          territoryManager: "TM",
          storeName: "Store",
          serviceProvider: "SP",
        }),
      });

    for (let i = 0; i < 10; i++) {
      const res = await POST(makeReq() as unknown as NextRequest);
      expect(res.status).toBe(200);
    }

    const blocked = await POST(makeReq() as unknown as NextRequest);
    const blockedBody = await blocked.json();

    expect(blocked.status).toBe(429);
    expect(blockedBody.error).toContain("Too many requests");
  });

  it("returns 500 when file write fails", async () => {
    vi.mocked(fs.mkdir).mockResolvedValue(undefined as never);
    vi.mocked(fs.readFile).mockResolvedValue("[]" as never);
    vi.mocked(fs.writeFile).mockRejectedValue(new Error("disk full"));

    const { POST } = await import("@/app/api/submit-form/route");

    const req = new Request("http://localhost/api/submit-form", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "3.3.3.3",
      },
      body: JSON.stringify({
        territoryManager: "TM",
        storeName: "Store",
        serviceProvider: "SP",
      }),
    });

    const res = await POST(req as unknown as NextRequest);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toContain("Failed to save submission");
  });
});
