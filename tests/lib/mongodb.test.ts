// @vitest-environment node

import { MongoClient } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("mongodb", () => ({
  MongoClient: vi.fn(),
}));

describe("lib/mongodb", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("throws on import when MONGODB_URI is missing", async () => {
    vi.stubEnv("MONGODB_URI", "");

    await expect(import("@/lib/mongodb")).rejects.toThrow("MONGODB_URI");
  });

  it("returns DB from explicit dbName argument", async () => {
    vi.stubEnv("MONGODB_URI", "mongodb+srv://user:pw@cluster/store-visits");

    const db = vi.fn().mockReturnValue({ name: "custom-db" });
    const connect = vi.fn().mockResolvedValue({ db });

    vi.mocked(MongoClient).mockImplementation(function MockMongoClient() {
      return { connect } as unknown as MongoClient;
    } as unknown as typeof MongoClient);

    const mongodbModule = await import("@/lib/mongodb");
    const database = await mongodbModule.getDb("custom-db");

    expect(connect).toHaveBeenCalledTimes(1);
    expect(db).toHaveBeenCalledWith("custom-db");
    expect(database).toEqual({ name: "custom-db" });
  });

  it("uses MONGODB_DB when dbName argument is omitted", async () => {
    vi.stubEnv("MONGODB_URI", "mongodb+srv://user:pw@cluster/store-visits");
    vi.stubEnv("MONGODB_DB", "configured-db");

    const db = vi.fn().mockReturnValue({ name: "configured-db" });
    const connect = vi.fn().mockResolvedValue({ db });

    vi.mocked(MongoClient).mockImplementation(
      function MockMongoClientConfiguredDb() {
        return { connect } as unknown as MongoClient;
      } as unknown as typeof MongoClient,
    );

    const mongodbModule = await import("@/lib/mongodb");
    const database = await mongodbModule.getDb();

    expect(db).toHaveBeenCalledWith("configured-db");
    expect(database).toEqual({ name: "configured-db" });
  });
});
