import { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
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

const POPUP_WIDTH = 360;
const POPUP_HEIGHT = 440;

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    'Hi! I\'m your AI assistant. Try:\n\n"Add two burgers and a lemonade"\n"Remove the pasta"\n"What drinks do you have?"',
  timestamp: Date.now(),
};

export default function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fabScaleAnim = useRef(new Animated.Value(1)).current;
  const { addItem, removeItem, clearCart, items: cartItems } = useCart();

  useEffect(() => {
    fetchMenu()
      .then((data) => setMenuItems(data.items))
      .catch(() => {});
  }, []);

  const toggleChat = useCallback(() => {
    const opening = !isOpen;
    if (opening) setHasUnread(false);

    Animated.spring(scaleAnim, {
      toValue: opening ? 1 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();

    Animated.sequence([
      Animated.timing(fabScaleAnim, {
        toValue: 0.85,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fabScaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    setIsOpen(opening);
  }, [isOpen, scaleAnim, fabScaleAnim]);

  const applyActions = useCallback(
    (actions: AICartAction[]) => {
      for (const action of actions) {
        switch (action.type) {
          case "add_item": {
            const menuItem = menuItems.find(
              (mi) => mi.name.toLowerCase() === action.itemName.toLowerCase()
            );
            if (menuItem) {
              addItem(menuItem, action.quantity || 1, action.size, action.modifiers);
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
      if (!isOpen) setHasUnread(true);
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
  }, [input, isTyping, applyActions, isOpen]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen, scrollToBottom]);

  const popupScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const popupOpacity = scaleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 1],
  });

  return (
    <View style={[styles.anchor, { pointerEvents: "box-none" }]}>
      <Animated.View
        style={[
          styles.popup,
          {
            opacity: popupOpacity,
            transform: [
              { scale: popupScale },
              {
                translateY: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
          !isOpen && styles.popupHidden,
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>🤖</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <Text style={styles.headerSubtitle}>
                {isTyping ? "Typing..." : "Online"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={toggleChat}
            style={styles.minimizeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <FontAwesome name="chevron-down" size={12} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

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
              size={13}
              color={
                input.trim() && !isTyping
                  ? Colors.textLight
                  : Colors.textTertiary
              }
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: fabScaleAnim }] }}>
        <TouchableOpacity
          style={styles.fab}
          onPress={toggleChat}
          activeOpacity={0.85}
        >
          <FontAwesome
            name={isOpen ? "times" : "comment"}
            size={22}
            color={Colors.textLight}
          />
          {hasUnread && !isOpen && <View style={styles.unreadDot} />}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: "absolute",
    bottom: 70,
    right: Spacing.md,
    alignItems: "flex-end",
    zIndex: 1000,
  },
  popup: {
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.large,
  },
  popupHidden: {
    position: "absolute",
    bottom: 64,
    right: 0,
    opacity: 0,
    pointerEvents: "none",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    fontSize: 16,
  },
  headerTitle: {
    ...Typography.bodySmall,
    fontWeight: "700",
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  minimizeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
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
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 3,
    gap: Spacing.xs,
  },
  input: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.text,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? Spacing.sm : Spacing.xs + 3,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: Colors.surfaceAlt,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.large,
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
});
