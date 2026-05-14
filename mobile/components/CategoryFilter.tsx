import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { MenuCategory } from "@/types";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";

interface CategoryFilterProps {
  selected: MenuCategory | "all";
  onSelect: (category: MenuCategory | "all") => void;
}

const categories: { key: MenuCategory | "all"; label: string; icon: string }[] =
  [
    { key: "all", label: "All", icon: "🍽️" },
    { key: "mains", label: "Mains", icon: "🥘" },
    { key: "sides", label: "Sides", icon: "🍟" },
    { key: "drinks", label: "Drinks", icon: "🥤" },
    { key: "desserts", label: "Desserts", icon: "🍰" },
  ];

export default function CategoryFilter({
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((cat) => {
          const isActive = selected === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(cat.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>{cat.icon}</Text>
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing.sm,
  },
  container: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipText: {
    ...Typography.bodySmall,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.textLight,
  },
});
