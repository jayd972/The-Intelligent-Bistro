import { AssistantResponse, CartAction } from "../types";
import { menuItems } from "../data/menu";

const numberWords: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  a: 1, an: 1,
};

function parseQuantity(text: string): number {
  const lower = text.toLowerCase().trim();
  if (numberWords[lower] !== undefined) return numberWords[lower];
  const num = parseInt(lower, 10);
  return isNaN(num) ? 1 : num;
}

function findMenuItem(text: string): string | null {
  const lower = text.toLowerCase();

  // Try exact name match first, then partial match (longest match wins)
  const sorted = [...menuItems].sort((a, b) => b.name.length - a.name.length);

  for (const item of sorted) {
    if (lower.includes(item.name.toLowerCase())) {
      return item.name;
    }
  }

  // Try matching individual key words from item names
  for (const item of sorted) {
    const keywords = item.name.toLowerCase().split(/\s+/);
    const significantWords = keywords.filter(
      (w) => w.length > 3 && !["with", "and", "the"].includes(w)
    );
    if (significantWords.some((word) => lower.includes(word))) {
      return item.name;
    }
  }

  return null;
}

function extractSize(text: string): "small" | "medium" | "large" | undefined {
  const lower = text.toLowerCase();
  if (lower.includes("large")) return "large";
  if (lower.includes("medium")) return "medium";
  if (lower.includes("small")) return "small";
  return undefined;
}

function isGreeting(text: string): boolean {
  const greetings = ["hello", "hi", "hey", "howdy", "greetings", "what's up", "good morning", "good afternoon", "good evening"];
  const lower = text.toLowerCase().trim();
  return greetings.some((g) => lower.startsWith(g) || lower === g);
}

function isQuestion(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return (
    lower.includes("what") ||
    lower.includes("how much") ||
    lower.includes("do you have") ||
    lower.includes("is there") ||
    lower.includes("menu") ||
    lower.endsWith("?")
  );
}

export function fallbackParse(message: string): AssistantResponse {
  const lower = message.toLowerCase().trim();

  if (isGreeting(lower)) {
    return {
      intent: "greeting",
      actions: [],
      assistantMessage:
        "Hello! Welcome to Intelligent Bistro. I can help you add items to your cart. Try saying something like \"Add two burgers and a lemonade\" or \"Remove the pasta from my cart.\"",
    };
  }

  if (lower.includes("clear") && lower.includes("cart")) {
    return {
      intent: "cart_update",
      actions: [{ type: "clear_cart", itemName: "" }],
      assistantMessage: "Done! I've cleared your entire cart.",
    };
  }

  if (isQuestion(lower) && !lower.includes("add") && !lower.includes("remove")) {
    const categories = ["mains", "sides", "drinks", "desserts"] as const;
    for (const cat of categories) {
      if (lower.includes(cat) || lower.includes(cat.slice(0, -1))) {
        const items = menuItems.filter((i) => i.category === cat);
        const list = items.map((i) => `${i.name} ($${i.price.toFixed(2)})`).join(", ");
        return {
          intent: "question",
          actions: [],
          assistantMessage: `Our ${cat} include: ${list}. Would you like to add any of these?`,
        };
      }
    }
    return {
      intent: "question",
      actions: [],
      assistantMessage:
        "We have Mains, Sides, Drinks, and Desserts. You can ask about any category or just tell me what you'd like to order!",
    };
  }

  const isRemove = lower.includes("remove") || lower.includes("delete") || lower.includes("take off") || lower.includes("cancel");

  // Split on "and" or commas to handle multi-item requests
  const parts = message.split(/(?:,|\band\b)/i).map((p) => p.trim()).filter(Boolean);

  const actions: CartAction[] = [];
  const addedNames: string[] = [];
  const notFound: string[] = [];

  for (const part of parts) {
    const itemName = findMenuItem(part);
    if (!itemName) {
      // Only flag as not found if it looks like an item reference
      if (part.length > 2 && !part.toLowerCase().match(/^(add|remove|please|i want|i'd like|get me|can i have|order)/)) {
        notFound.push(part.trim());
      }
      continue;
    }

    const size = extractSize(part);

    // Look for a quantity word or number before the item name
    const quantityMatch = part.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten|a|an)\s/i);
    const quantity = quantityMatch ? parseQuantity(quantityMatch[1]) : 1;

    if (isRemove) {
      actions.push({ type: "remove_item", itemName, quantity });
    } else {
      actions.push({ type: "add_item", itemName, quantity, size });
    }
    addedNames.push(`${quantity > 1 ? quantity + " " : ""}${itemName}${size ? ` (${size})` : ""}`);
  }

  if (actions.length === 0) {
    const menuNames = menuItems.slice(0, 5).map((i) => i.name).join(", ");
    return {
      intent: "unknown",
      actions: [],
      assistantMessage: `I couldn't find that item on our menu. Try items like: ${menuNames}, and more. What would you like to order?`,
    };
  }

  const verb = isRemove ? "Removed" : "Added";
  const listing = addedNames.join(", ");
  const suffix = isRemove ? " from your cart." : " to your cart.";
  let assistantMessage = `${verb} ${listing}${suffix}`;

  if (notFound.length > 0) {
    assistantMessage += ` I couldn't find "${notFound.join('", "')}" on our menu.`;
  }

  return {
    intent: "cart_update",
    actions,
    assistantMessage,
  };
}
