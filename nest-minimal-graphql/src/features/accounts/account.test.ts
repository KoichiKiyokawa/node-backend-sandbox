import { expect, test } from "vite-plus/test";
import { Account, InvalidAccountDisplayNameError } from "./account.js";

test("trims a display name and preserves internal spaces", () => {
  const account = new Account("1", "  Ada  Lovelace  ");

  expect(account).toEqual({ id: "1", displayName: "Ada  Lovelace" });
});

test("changes the display name while preserving the account identity", () => {
  const account = new Account("1", "Ada");
  const changed = account.changeDisplayName("  Ada Lovelace  ");

  expect(changed).toEqual({ id: "1", displayName: "Ada Lovelace" });
  expect(account.displayName).toBe("Ada");
});

test.each(["", " \t\n "])("rejects a blank display name (%j)", (displayName) => {
  const account = new Account("1", "Ada");

  expect(() => account.changeDisplayName(displayName)).toThrow(InvalidAccountDisplayNameError);
  expect(account.displayName).toBe("Ada");
});
