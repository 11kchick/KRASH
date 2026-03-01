import { describe, it, expect } from "vitest";
import { filterMessage } from "./content-filter";

describe("content-filter", () => {
  it("allows normal messages", () => {
    expect(filterMessage("Hey, what hotel are we booking?").blocked).toBe(false);
  });

  it("blocks offensive words", () => {
    const result = filterMessage("you're a retard");
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("offensive");
  });

  it("blocks sexual content", () => {
    const result = filterMessage("check out this porn site");
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("sexual");
  });

  it("blocks unsafe/threatening content", () => {
    const result = filterMessage("kill yourself");
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("unsafe");
  });

  it("blocks SSN patterns", () => {
    const result = filterMessage("my ssn is 123-45-6789");
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("sensitive_info");
  });

  it("blocks credit card patterns", () => {
    const result = filterMessage("card 4111-1111-1111-1111");
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe("sensitive_info");
  });

  it("returns warning message when blocked", () => {
    const result = filterMessage("you retard");
    expect(result.message).toBeTruthy();
    expect(result.message).toContain("offensive");
  });
});
