import React, { createContext, useContext, useReducer, useMemo } from "react";
import { CartItem, MenuItem } from "@/types";

// ─── Actions ─────────────────────────────────────────────────

type CartAction =
  | { type: "ADD_ITEM"; payload: { item: MenuItem; quantity?: number; size?: string; modifiers?: string[] } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

// ─── State ───────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

// ─── Reducer ─────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity = 1, size, modifiers = [] } = action.payload;

      const existing = state.items.find(
        (ci) =>
          ci.menuItemId === item.id &&
          ci.size === size &&
          JSON.stringify(ci.modifiers) === JSON.stringify(modifiers)
      );

      if (existing) {
        return {
          items: state.items.map((ci) =>
            ci.id === existing.id
              ? { ...ci, quantity: ci.quantity + quantity }
              : ci
          ),
        };
      }

      const newItem: CartItem = {
        id: `${item.id}-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
        size: size as CartItem["size"],
        modifiers,
      };

      return { items: [...state.items, newItem] };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter((ci) => ci.id !== action.payload.id),
      };

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { items: state.items.filter((ci) => ci.id !== id) };
      }
      return {
        items: state.items.map((ci) =>
          ci.id === id ? { ...ci, quantity } : ci
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number, size?: string, modifiers?: string[]) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────

const TAX_RATE = 0.08;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = state.items.reduce((sum, ci) => sum + ci.quantity, 0);
    const subtotal = state.items.reduce(
      (sum, ci) => sum + ci.price * ci.quantity,
      0
    );
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return {
      items: state.items,
      addItem: (item, quantity, size, modifiers) =>
        dispatch({ type: "ADD_ITEM", payload: { item, quantity, size, modifiers } }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
      updateQuantity: (id, quantity) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      totalItems,
      subtotal,
      tax,
      total,
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
