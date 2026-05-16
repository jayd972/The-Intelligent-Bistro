import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MenuItem } from "@/types";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
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
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleAdd = () => {
    onAddToCart(item);
    setAdded(true);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
    ]).start();

    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.cardInner}
        onPress={handleAdd}
        activeOpacity={0.7}
      >
        <View style={styles.textSection}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {item.popular && (
              <View style={styles.popularBadge}>
                <FontAwesome name="star" size={8} color="#B8860B" />
              </View>
            )}
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            {item.availableModifiers && item.availableModifiers.length > 0 && (
              <>
                <View style={styles.metaDot} />
                <Text style={styles.metaText}>Customizable</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.imageSection}>
          <View style={styles.emojiWrap}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, added && styles.addBtnActive]}
            onPress={handleAdd}
            activeOpacity={0.8}
          >
            {added ? (
              <FontAwesome name="check" size={12} color={Colors.textLight} />
            ) : (
              <FontAwesome name="plus" size={12} color={Colors.textLight} />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  cardInner: {
    flexDirection: "row",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  textSection: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
    marginBottom: 3,
  },
  name: {
    ...Typography.h3,
    color: Colors.text,
    flex: 1,
  },
  popularBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    ...Typography.price,
    color: Colors.text,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textTertiary,
    marginHorizontal: Spacing.sm,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  imageSection: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  emojiWrap: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 44,
  },
  addBtn: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  addBtnActive: {
    backgroundColor: Colors.success,
  },
});
