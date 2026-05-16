import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { ChatMessage } from "@/types";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <View style={styles.systemRow}>
        <View style={styles.systemCard}>
          <Text style={styles.systemText}>{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🤖</Text>
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
        ]}
      >
        <Text
          style={[
            styles.text,
            isUser ? styles.textUser : styles.textAssistant,
          ]}
        >
          {message.content}
        </Text>
        <Text
          style={[
            styles.time,
            isUser ? styles.timeUser : styles.timeAssistant,
          ]}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}

export function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 150);
    const a3 = animate(dot3, 300);
    a1.start();
    a2.start();
    a3.start();

    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>🤖</Text>
      </View>
      <View style={[styles.bubble, styles.bubbleAssistant, styles.typingBubble]}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm + 2,
  },
  rowUser: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.xs + 2,
  },
  avatarText: {
    fontSize: 14,
  },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: BorderRadius.xs,
  },
  bubbleAssistant: {
    backgroundColor: Colors.surfaceAlt,
    borderBottomLeftRadius: BorderRadius.xs,
  },
  text: {
    ...Typography.bodySmall,
    lineHeight: 19,
  },
  textUser: {
    color: Colors.textLight,
  },
  textAssistant: {
    color: Colors.text,
  },
  time: {
    fontSize: 10,
    marginTop: 3,
  },
  timeUser: {
    color: "rgba(255,255,255,0.6)",
    textAlign: "right",
  },
  timeAssistant: {
    color: Colors.textTertiary,
  },
  typingBubble: {
    paddingVertical: Spacing.sm + 2,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.textTertiary,
  },
  systemRow: {
    alignItems: "center",
    marginBottom: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
  },
  systemCard: {
    backgroundColor: Colors.successSoft,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: "rgba(0, 131, 62, 0.15)",
  },
  systemText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: "600",
  },
});
