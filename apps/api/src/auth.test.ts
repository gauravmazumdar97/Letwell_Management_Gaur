import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { registerSchema } from "./validation/auth.js";

describe("auth validation", () => {
  it("accepts manager registration payload shape", () => {
    const parsed = registerSchema.safeParse({
      email: "new@letwell.test",
      password: "Password123!",
      name: "New User",
      asTenant: false,
      asManager: true,
      managerMessage: "I manage two flats in London.",
    });
    assert.equal(parsed.success, true);
  });

  it("rejects short passwords", () => {
    const parsed = registerSchema.safeParse({
      email: "new@letwell.test",
      password: "short",
      name: "New User",
      asTenant: true,
    });
    assert.equal(parsed.success, false);
  });
});
