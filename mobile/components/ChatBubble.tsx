import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChatMessage } from "@/types";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

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
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>🤖</Text>
      </View>
      <View style={[styles.bubble, styles.bubbleAssistant, styles.typingBubble]}>
        <Text style={styles.typingDots}>●  ●  ●</Text>
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
  typingDots: {
    color: Colors.textTertiary,
    fontSize: 12,
    letterSpacing: 2,
  },
});
