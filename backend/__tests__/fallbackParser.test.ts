import { fallbackParse } from "../src/services/fallbackParser";

describe("fallbackParser", () => {
  // ── Greetings ─────────────────────────────────────────────
  describe("greetings", () => {
    it("recognizes 'Hello!'", () => {
      const result = fallbackParse("Hello!");
      expect(result.intent).toBe("greeting");
      expect(result.actions).toHaveLength(0);
      expect(result.assistantMessage).toBeTruthy();
    });

    it("recognizes 'Hey there'", () => {
      const result = fallbackParse("Hey there");
      expect(result.intent).toBe("greeting");
    });
  });

  // ── Adding items ──────────────────────────────────────────
  describe("adding items", () => {
    it("adds a single item by keyword", () => {
      const result = fallbackParse("Add a burger");
      expect(result.intent).toBe("cart_update");
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0].type).toBe("add_item");
      expect(result.actions[0].itemName).toBe("Classic Smash Burger");
      expect(result.actions[0].quantity).toBe(1);
    });

    it("parses numeric quantities", () => {
      const result = fallbackParse("Add 3 burgers");
      expect(result.actions[0].quantity).toBe(3);
    });

    it("parses word quantities", () => {
      const result = fallbackParse("Add two lemonades");
      expect(result.actions[0].quantity).toBe(2);
    });

    it("handles multiple items with 'and'", () => {
      const result = fallbackParse("Add two burgers and a lemonade");
      expect(result.intent).toBe("cart_update");
      expect(result.actions.length).toBeGreaterThanOrEqual(2);
    });

    it("extracts size when specified", () => {
      const result = fallbackParse("Add a large lemonade");
      expect(result.actions[0].size).toBe("large");
    });
  });

  // ── Removing items ────────────────────────────────────────
  describe("removing items", () => {
    it("removes an item", () => {
      const result = fallbackParse("Remove the pasta");
      expect(result.intent).toBe("cart_update");
      expect(result.actions[0].type).toBe("remove_item");
      expect(result.actions[0].itemName).toBe("Truffle Mushroom Pasta");
    });
  });

  // ── Cart clearing ─────────────────────────────────────────
  describe("clear cart", () => {
    it("clears the entire cart", () => {
      const result = fallbackParse("Clear my cart");
      expect(result.intent).toBe("cart_update");
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0].type).toBe("clear_cart");
    });
  });

  // ── Questions ─────────────────────────────────────────────
  describe("menu questions", () => {
    it("answers category questions", () => {
      const result = fallbackParse("What drinks do you have?");
      expect(result.intent).toBe("question");
      expect(result.actions).toHaveLength(0);
      expect(result.assistantMessage).toContain("drinks");
    });

    it("answers generic menu questions", () => {
      const result = fallbackParse("What's on the menu?");
      expect(result.intent).toBe("question");
    });
  });

  // ── Unknown items ─────────────────────────────────────────
  describe("unknown items", () => {
    it("returns unknown for unrecognized items", () => {
      const result = fallbackParse("Add a unicorn steak");
      expect(result.intent).toBe("unknown");
      expect(result.actions).toHaveLength(0);
    });
  });
});
