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
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  rowUser: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  avatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    ...Typography.body,
    lineHeight: 22,
  },
  textUser: {
    color: Colors.textLight,
  },
  textAssistant: {
    color: Colors.text,
  },
  time: {
    ...Typography.caption,
    marginTop: 4,
  },
  timeUser: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  timeAssistant: {
    color: Colors.textSecondary,
  },
  typingBubble: {
    paddingVertical: Spacing.md,
  },
  typingDots: {
    color: Colors.textSecondary,
    fontSize: 14,
    letterSpacing: 2,
  },
});
