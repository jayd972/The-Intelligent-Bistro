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
    { key: "mains", label: "Mains", icon: "🍔" },
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
              <View style={[styles.iconCircle, isActive && styles.iconCircleActive]}>
                <Text style={styles.chipIcon}>{cat.icon}</Text>
              </View>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.md + 4,
  },
  chip: {
    alignItems: "center",
    gap: Spacing.xs + 2,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  chipActive: {
    borderBottomColor: Colors.primary,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleActive: {
    backgroundColor: Colors.primarySoft,
  },
  chipIcon: {
    fontSize: 26,
  },
  chipText: {
    ...Typography.caption,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
});
