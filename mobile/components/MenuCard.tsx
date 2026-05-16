import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { MenuItem } from "@/types";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from "@/constants/theme";
import { menuImages } from "@/constants/images";


interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const imageSource = menuImages[item.image];
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
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            {item.availableModifiers && item.availableModifiers.length > 0 && (
              <View style={styles.customBadge}>
                <Text style={styles.customBadgeText}>Customizable</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.imageSection}>
          <View style={styles.imageWrap}>
            {imageSource ? (
              <Image source={imageSource} style={styles.foodImage} />
            ) : (
              <Text style={styles.fallbackEmoji}>🍽️</Text>
            )}
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
    marginHorizontal: Spacing.sm + 4,
    marginBottom: Spacing.sm + 4,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.small,
  },
  cardInner: {
    flexDirection: "row",
    padding: Spacing.sm + 6,
    gap: Spacing.sm + 4,
  },
  textSection: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 3,
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
    gap: Spacing.sm,
  },
  price: {
    ...Typography.price,
    color: Colors.text,
  },
  customBadge: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  imageSection: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  imageWrap: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.md + 2,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  foodImage: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.md + 2,
  },
  fallbackEmoji: {
    fontSize: 40,
  },
  addBtn: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
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
