import OpenAI from "openai";
import { AssistantResponse } from "../types";
import { menuItems } from "../data/menu";

function getClient(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function buildSystemPrompt(): string {
  const menuSummary = menuItems
    .map(
      (item) =>
        `- ${item.name} (${item.category}, $${item.price.toFixed(2)})` +
        (item.availableSizes ? ` [sizes: ${item.availableSizes.join(", ")}]` : "") +
        (item.availableModifiers ? ` [modifiers: ${item.availableModifiers.join(", ")}]` : "")
    )
    .join("\n");

  return `You are an AI ordering assistant for Intelligent Bistro, a premium restaurant.

Your job is to interpret the customer's natural language message and return a structured JSON response that the app uses to update their cart.

MENU:
${menuSummary}

RESPONSE FORMAT (strict JSON, no markdown):
{
  "intent": "cart_update" | "question" | "greeting" | "unknown",
  "actions": [
    {
      "type": "add_item" | "remove_item" | "update_quantity" | "clear_cart",
      "itemName": "exact menu item name",
      "quantity": number,
      "size": "small" | "medium" | "large" (optional, only if applicable),
      "modifiers": ["modifier1"] (optional)
    }
  ],
  "assistantMessage": "friendly confirmation message to the customer"
}

RULES:
1. Match user requests to EXACT menu item names from the list above.
2. If the user asks to "clear cart" or "remove everything", use type "clear_cart" with an empty itemName.
3. If the user asks a question about the menu, set intent to "question" with no actions.
4. If the user greets you, set intent to "greeting" with no actions.
5. If you can't match an item, set intent to "unknown" and suggest similar items.
6. Default quantity is 1 if not specified.
7. Only include size if the item has available sizes.
8. Only include modifiers if they match available modifiers for that item.
9. Be friendly and conversational in the assistantMessage.
10. Return ONLY valid JSON. No markdown, no code fences, no extra text.`;
}

export async function aiParse(message: string): Promise<AssistantResponse> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: message },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const parsed: AssistantResponse = JSON.parse(content);

  // Validate the response has required fields
  if (!parsed.intent || !Array.isArray(parsed.actions) || !parsed.assistantMessage) {
    throw new Error("Invalid response structure from OpenAI");
  }

  return parsed;
}
