// @vitest-environment node

import {
  GET as getDebugEnv,
  POST as postDebugEnv,
} from "@/app/api/debug-env/route";
import { GET as getEnvTest } from "@/app/api/env-test/route";
import { describe, expect, it } from "vitest";

describe("environment diagnostic routes", () => {
  it("debug-env GET returns environment metadata", async () => {
    const res = await getDebugEnv();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({
      hasMongoUri: expect.any(Boolean),
      totalEnvVars: expect.any(Number),
      allMongoKeys: expect.any(Array),
    });
  });

  it("debug-env POST returns POST diagnostics", async () => {
    const res = await postDebugEnv();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({
      timestamp: expect.any(String),
      hasMongoUri: expect.any(Boolean),
      processEnvKeys: expect.any(Number),
    });
  });

  it("env-test GET returns expected shape", async () => {
    const res = await getEnvTest();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({
      hasMongoUri: expect.any(Boolean),
      nodeEnv: expect.any(String),
      allEnvKeys: expect.any(Array),
    });

    if (Object.prototype.hasOwnProperty.call(body, "mongoDb")) {
      expect(typeof body.mongoDb === "string" || body.mongoDb === null).toBe(
        true,
      );
    }
  });
});
