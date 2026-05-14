import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
        <Text style={styles.buttonText}>−</Text>
      </TouchableOpacity>

      <View style={styles.countContainer}>
        <Text style={styles.count}>{quantity}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.incrementButton]}
        onPress={onIncrement}
        activeOpacity={0.6}
      >
        <Text style={[styles.buttonText, styles.incrementText]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
  },
  incrementButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  incrementText: {
    color: Colors.textLight,
  },
  countContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
  },
  count: {
    ...Typography.button,
    color: Colors.text,
  },
});
