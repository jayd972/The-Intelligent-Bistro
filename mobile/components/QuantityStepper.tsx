import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
}: QuantityStepperProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onDecrement}
        activeOpacity={0.6}
      >
        <FontAwesome name="minus" size={12} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.countContainer}>
        <Text style={styles.count}>{quantity}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.incrementButton]}
        onPress={onIncrement}
        activeOpacity={0.6}
      >
        <FontAwesome name="plus" size={12} color={Colors.textLight} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    overflow: "hidden",
  },
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  incrementButton: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
  },
  countContainer: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    ...Typography.button,
    fontWeight: "700",
    color: Colors.text,
  },
});
