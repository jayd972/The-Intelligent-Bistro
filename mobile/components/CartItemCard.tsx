import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CartItem } from "@/types";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from "@/constants/theme";
import QuantityStepper from "./QuantityStepper";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.nameSection}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {item.size && (
            <Text style={styles.detail}>
              Size: {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
            </Text>
          )}
          {item.modifiers.length > 0 && (
            <Text style={styles.detail}>{item.modifiers.join(", ")}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          style={styles.removeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name="trash-o" size={16} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <QuantityStepper
          quantity={item.quantity}
          onIncrement={() => onUpdateQuantity(item.id, item.quantity + 1)}
          onDecrement={() => onUpdateQuantity(item.id, item.quantity - 1)}
        />

        <View style={styles.priceSection}>
          <Text style={styles.unitPrice}>
            ${item.price.toFixed(2)} each
          </Text>
          <Text style={styles.lineTotal}>${lineTotal.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    ...Shadows.small,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  nameSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  name: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 2,
  },
  detail: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceSection: {
    alignItems: "flex-end",
  },
  unitPrice: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  lineTotal: {
    ...Typography.price,
    color: Colors.primary,
  },
});
