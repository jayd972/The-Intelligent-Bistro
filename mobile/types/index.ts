// ─── Menu ────────────────────────────────────────────────────

export type MenuCategory = "mains" | "sides" | "drinks" | "desserts";

export type MenuItemSize = "small" | "medium" | "large";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  popular?: boolean;
  availableSizes?: MenuItemSize[];
  availableModifiers?: string[];
}

// ─── Cart ────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  size?: MenuItemSize;
  modifiers: string[];
}

// ─── AI Assistant ────────────────────────────────────────────

export interface AssistantRequest {
  message: string;
  cartItems?: CartItem[];
}

export type ActionType = "add_item" | "remove_item" | "update_quantity" | "clear_cart";

export interface CartAction {
  type: ActionType;
  itemName: string;
  quantity?: number;
  size?: MenuItemSize;
  modifiers?: string[];
}

export interface AssistantResponse {
  intent: "cart_update" | "question" | "greeting" | "unknown";
  actions: CartAction[];
  assistantMessage: string;
}

// ─── Chat UI ─────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
