// @vitest-environment node

import { MongoClient } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("mongodb", () => ({
  MongoClient: vi.fn(),
}));

describe("GET /api/test-db", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("returns 500 when MONGODB_URI is missing", async () => {
    vi.stubEnv("MONGODB_URI", "");

    const { GET } = await import("@/app/api/test-db/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toContain("MONGODB_URI");
  });

  it("returns 500 when placeholder password is present", async () => {
    vi.stubEnv("MONGODB_URI", "mongodb+srv://user:<db_password>@cluster/db");

    const { GET } = await import("@/app/api/test-db/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toContain("replace <db_password>");
  });

  it("returns success when MongoDB client connects and counts docs", async () => {
    vi.stubEnv("MONGODB_URI", "mongodb+srv://user:pw@cluster/store-visits");
    vi.stubEnv("MONGODB_DB", "store-visits");

    const close = vi.fn().mockResolvedValue(undefined);
    const countDocuments = vi.fn().mockResolvedValue(42);
    const collection = vi.fn().mockReturnValue({ countDocuments });
    const db = vi.fn().mockReturnValue({ collection });
    const connect = vi.fn().mockResolvedValue(undefined);

    vi.mocked(MongoClient).mockImplementation(function MockMongoClient() {
      return { connect, db, close } as unknown as MongoClient;
    } as unknown as typeof MongoClient);

    const { GET } = await import("@/app/api/test-db/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({
      success: true,
      message: "MongoDB connection successful",
      documentCount: 42,
      database: "store-visits",
    });

    expect(connect).toHaveBeenCalledTimes(1);
    expect(db).toHaveBeenCalledWith("store-visits");
    expect(collection).toHaveBeenCalledWith("store-visits");
    expect(close).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when MongoDB connect throws", async () => {
    vi.stubEnv("MONGODB_URI", "mongodb+srv://user:pw@cluster/store-visits");

    vi.mocked(MongoClient).mockImplementation(
      function MockMongoClientFailure() {
        return {
          connect: vi.fn().mockRejectedValue(new Error("network down")),
        } as unknown as MongoClient;
      } as unknown as typeof MongoClient,
    );

    const { GET } = await import("@/app/api/test-db/route");
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("MongoDB connection failed");
    expect(body.details).toContain("network down");
  });
});
