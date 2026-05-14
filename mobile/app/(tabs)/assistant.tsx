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
  Shadows,
} from "@/constants/theme";
import { ChatMessage, MenuItem, CartAction as AICartAction } from "@/types";
import { sendMessage, fetchMenu } from "@/services/api";
import { useCart } from "@/context/CartContext";
import ChatBubble, { TypingIndicator } from "@/components/ChatBubble";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    'Welcome to Intelligent Bistro! 🍽️\n\nI can help you manage your order. Try saying things like:\n\n• "Add two burgers and a lemonade"\n• "Remove the pasta"\n• "What drinks do you have?"\n• "Clear my cart"',
  timestamp: Date.now(),
};

export default function AssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const { addItem, removeItem, clearCart, items: cartItems } = useCart();

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
              (mi) =>
                mi.name.toLowerCase() === action.itemName.toLowerCase()
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
              (ci) =>
                ci.name.toLowerCase() === action.itemName.toLowerCase()
            );
            if (cartItem) {
              removeItem(cartItem.id);
            }
            break;
          }
          case "clear_cart":
            clearCart();
            break;
        }
      }
    },
    [menuItems, cartItems, addItem, removeItem, clearCart]
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
      }

      const cartBadge =
        response.intent === "cart_update" && response.actions.length > 0
          ? " 🛒"
          : "";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.assistantMessage + cartBadge,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Sorry, I had trouble processing that. Please make sure the backend server is running and try again.",
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

  const renderSuggestion = (text: string) => (
    <TouchableOpacity
      key={text}
      style={styles.suggestionChip}
      onPress={() => {
        setInput(text);
      }}
      activeOpacity={0.7}
    >
      <Text style={styles.suggestionText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
      />

      {messages.length <= 1 && !isTyping && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsLabel}>Quick suggestions:</Text>
          <View style={styles.suggestionsRow}>
            {renderSuggestion("Add a burger and fries")}
            {renderSuggestion("What desserts do you have?")}
            {renderSuggestion("Add two lemonades")}
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Tell me what you'd like to order..."
            placeholderTextColor={Colors.textSecondary}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            editable={!isTyping}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!input.trim() || isTyping) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!input.trim() || isTyping}
            activeOpacity={0.7}
          >
            <FontAwesome
              name="send"
              size={16}
              color={
                input.trim() && !isTyping
                  ? Colors.textLight
                  : Colors.textSecondary
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  messageList: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  suggestionsContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  suggestionsLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  suggestionChip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  suggestionText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: "600",
  },
  inputContainer: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.md,
    ...Shadows.small,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    maxHeight: 100,
    paddingVertical: Spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
  },
});
