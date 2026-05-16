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
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm + 4,
    justifyContent: "space-between",
  },
  chip: {
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.xs + 2,
    borderRadius: BorderRadius.lg,
  },
  chipActive: {
    backgroundColor: Colors.primarySoft,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleActive: {
    backgroundColor: Colors.primarySoft,
  },
  chipIcon: {
    fontSize: 22,
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
