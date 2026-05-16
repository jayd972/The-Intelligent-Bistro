import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Colors, BorderRadius } from "@/constants/theme";
import { useCart } from "@/context/CartContext";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  badge?: number;
}) {
  const { badge, ...iconProps } = props;
  return (
    <View style={iconStyles.iconWrap}>
      <FontAwesome size={22} {...iconProps} />
      {badge !== undefined && badge > 0 && (
        <View style={iconStyles.badge}>
          <Text style={iconStyles.badgeText}>
            {badge > 99 ? "99+" : badge}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const { totalItems } = useCart();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.borderLight,
          height: Platform.OS === "ios" ? 84 : 60,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTitleStyle: {
          color: Colors.text,
          fontWeight: "700",
          fontSize: 17,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Menu",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="shopping-cart"
              color={color}
              badge={totalItems}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const iconStyles = StyleSheet.create({
  iconWrap: {
    position: "relative",
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -12,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.textLight,
    fontSize: 10,
    fontWeight: "700",
  },
});
