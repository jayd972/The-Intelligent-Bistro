import { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
} from "@/constants/theme";
import { ChatMessage, MenuItem, CartAction as AICartAction } from "@/types";
import { sendMessage, fetchMenu } from "@/services/api";
import { useCart } from "@/context/CartContext";
import ChatBubble, { TypingIndicator } from "@/components/ChatBubble";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    'Hi! I\'m Bistro, your smart ordering assistant. Try saying:\n\n"Add two burgers and a lemonade"\n"Remove the pasta"\n"What drinks do you have?"\n"Clear my cart"',
  timestamp: Date.now(),
};

export default function AssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const { addItem, removeItem, updateQuantity, clearCart, items: cartItems } =
    useCart();

  useEffect(() => {
    fetchMenu()
      .then((data) => setMenuItems(data.items))
      .catch(() => {});
  }, []);

  const applyActions = useCallback(
    (actions: AICartAction[]) => {
      for (const action of actions) {
        switch (action.type) {
          case "add_item": {
            const menuItem = menuItems.find(
              (mi) => mi.name.toLowerCase() === action.itemName.toLowerCase()
            );
            if (menuItem) {
              addItem(
                menuItem,
                action.quantity || 1,
                action.size,
                action.modifiers
              );
            }
            break;
          }
          case "remove_item": {
            const cartItem = cartItems.find(
              (ci) => ci.name.toLowerCase() === action.itemName.toLowerCase()
            );
            if (cartItem) removeItem(cartItem.id);
            break;
          }
          case "update_quantity": {
            const cartItem = cartItems.find(
              (ci) => ci.name.toLowerCase() === action.itemName.toLowerCase()
            );
            if (cartItem) updateQuantity(cartItem.id, action.quantity || 1);
            break;
          }
          case "clear_cart":
            clearCart();
            break;
        }
      }
    },
    [menuItems, cartItems, addItem, removeItem, updateQuantity, clearCart]
  );

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await sendMessage(text);

      if (response.intent === "cart_update" && response.actions.length > 0) {
        applyActions(response.actions);

        // Add visual cart update cards
        const actionCards: ChatMessage[] = response.actions.map((action, i) => {
          let icon = "";
          let label = "";
          switch (action.type) {
            case "add_item":
              icon = "✅";
              label = `Added ${action.quantity || 1}× ${action.itemName}${action.size ? ` (${action.size})` : ""}`;
              break;
            case "remove_item":
              icon = "🗑️";
              label = `Removed ${action.itemName}`;
              break;
            case "update_quantity":
              icon = "✏️";
              label = `Updated ${action.itemName} → ${action.quantity}`;
              break;
            case "clear_cart":
              icon = "🧹";
              label = "Cart cleared";
              break;
          }
          return {
            id: `action-${Date.now()}-${i}`,
            role: "system" as const,
            content: `${icon} ${label}`,
            timestamp: Date.now(),
          };
        });

        setMessages((prev) => [...prev, ...actionCards]);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.assistantMessage,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Sorry, I had trouble processing that. Please make sure the backend is running.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, applyActions]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>🤖</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Ask Bistro</Text>
          <Text style={styles.headerSubtitle}>
            {isTyping ? "Typing..." : "Online • Ready to help"}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        {["Add a burger", "What's popular?", "Clear cart"].map((q) => (
          <TouchableOpacity
            key={q}
            style={styles.quickChip}
            onPress={() => {
              setInput(q);
              setTimeout(() => {
                handleSend();
              }, 0);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.quickChipText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
        style={styles.messageArea}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your order..."
          placeholderTextColor={Colors.textTertiary}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          editable={!isTyping}
          maxLength={500}
          multiline={false}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!input.trim() || isTyping) && styles.sendBtnDisabled,
          ]}
          onPress={handleSend}
          disabled={!input.trim() || isTyping}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="arrow-up"
            size={14}
            color={
              input.trim() && !isTyping
                ? Colors.textLight
                : Colors.textTertiary
            }
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surface,
    gap: Spacing.sm + 2,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  quickChip: {
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  quickChipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  messageArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messageList: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? Spacing.sm + 2 : Spacing.sm,
    maxHeight: 100,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: Colors.surfaceAlt,
  },
});
