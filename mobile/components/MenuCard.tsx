import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MenuItem } from "@/types";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from "@/constants/theme";

const itemEmojis: Record<string, string> = {
  burger: "🍔",
  "chicken-sandwich": "🍗",
  salmon: "🐟",
  pasta: "🍝",
  tacos: "🌮",
  fries: "🍟",
  salad: "🥗",
  "onion-rings": "🧅",
  "sweet-potato": "🍠",
  "mac-cheese": "🧀",
  lemonade: "🍋",
  "iced-tea": "🍵",
  "root-beer": "🍺",
  "sparkling-water": "💧",
  brownie: "🍫",
  cheesecake: "🍰",
  churros: "🥐",
  sorbet: "🍧",
};

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const emoji = itemEmojis[item.image] || "🍽️";
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <View style={styles.card}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {item.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={[styles.addButton, added && styles.addedButton]}
            onPress={handleAdd}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>
              {added ? "✓ Added" : "+ Add"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    ...Shadows.small,
  },
  emojiContainer: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  emoji: {
    fontSize: 36,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: 2,
  },
  name: {
    ...Typography.h3,
    color: Colors.text,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  popularText: {
    ...Typography.caption,
    fontWeight: "700",
    color: Colors.secondary,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    ...Typography.price,
    color: Colors.primary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  addedButton: {
    backgroundColor: Colors.success,
  },
  addButtonText: {
    ...Typography.button,
    color: Colors.textLight,
    fontSize: 14,
  },
});
