// @vitest-environment node

import { GET as getServiceProviders } from "@/app/api/service-providers/route";
import { GET as getStores } from "@/app/api/stores/route";
import { GET as getTerritoryManagers } from "@/app/api/territory-managers/route";
import { describe, expect, it } from "vitest";

describe("dropdown API routes", () => {
  it("returns sorted territory managers with value/label/id mapping", async () => {
    const res = await getTerritoryManagers();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    const labels = body.data.map((item: { label: string }) => item.label);
    const sorted = [...labels].sort((a, b) => a.localeCompare(b));

    expect(labels).toEqual(sorted);
    expect(body.data[0]).toMatchObject({
      value: expect.any(String),
      label: expect.any(String),
    });
  });

  it("returns stores with label including store number and sorted names", async () => {
    const res = await getStores();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    const labels = body.data.map((item: { value: string }) => item.value);
    const sorted = [...labels].sort((a, b) => a.localeCompare(b));

    expect(labels).toEqual(sorted);
    expect(body.data[0]).toMatchObject({
      value: expect.any(String),
      label: expect.stringContaining(" - "),
      number: expect.any(String),
    });
  });

  it("returns service providers with active flag", async () => {
    const res = await getServiceProviders();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toMatchObject({
      value: expect.any(String),
      label: expect.any(String),
      active: expect.any(Boolean),
    });
  });
});
