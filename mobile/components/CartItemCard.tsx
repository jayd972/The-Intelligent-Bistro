import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CartItem } from "@/types";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
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
  const hasDetails = item.size || item.modifiers.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.nameSection}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {hasDetails && (
            <Text style={styles.detail}>
              {[
                item.size && (item.size.charAt(0).toUpperCase() + item.size.slice(1)),
                ...item.modifiers,
              ].filter(Boolean).join(" · ")}
            </Text>
          )}
          <Text style={styles.unitPrice}>
            ${item.price.toFixed(2)} each
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          style={styles.removeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.6}
        >
          <FontAwesome name="trash-o" size={14} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <QuantityStepper
          quantity={item.quantity}
          onIncrement={() => onUpdateQuantity(item.id, item.quantity + 1)}
          onDecrement={() => onUpdateQuantity(item.id, item.quantity - 1)}
        />
        <Text style={styles.lineTotal}>${lineTotal.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm + 4,
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
    marginBottom: 2,
  },
  unitPrice: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lineTotal: {
    ...Typography.price,
    color: Colors.text,
  },
});
