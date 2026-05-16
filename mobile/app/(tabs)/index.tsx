import { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Animated,
  TouchableOpacity,
  TextInput,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { MenuItem, MenuCategory } from "@/types";
import { fetchMenu, checkHealth } from "@/services/api";
import { useCart } from "@/context/CartContext";
import MenuCard from "@/components/MenuCard";
import CategoryFilter from "@/components/CategoryFilter";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function MenuScreen() {
  const { addItem } = useCart();
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<MenuCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [serverStatus, setServerStatus] = useState<"online" | "offline" | "connecting">("connecting");
  const [toast, setToast] = useState<string | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslate = useRef(new Animated.Value(20)).current;

  const showToast = useCallback(
    (message: string) => {
      setToast(message);
      toastTranslate.setValue(20);
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(toastTranslate, {
          toValue: 0,
          useNativeDriver: true,
          tension: 120,
          friction: 8,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(toastOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(toastTranslate, {
              toValue: 20,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => setToast(null));
        }, 1800);
      });
    },
    [toastOpacity, toastTranslate]
  );

  const loadMenu = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);
      
      // Ping health check first
      try {
        const health = await checkHealth();
        setServerStatus(health.status === "ok" ? "online" : "offline");
      } catch (err) {
        setServerStatus("offline");
      }

      const data = await fetchMenu();
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menu");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMenu(false);
  }, [loadMenu]);

  const searchFiltered = searchQuery.trim()
    ? items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : items;

  const filteredItems =
    category === "all"
      ? searchFiltered
      : searchFiltered.filter((item) => item.category === category);

  const popularItems = items.filter((item) => item.popular);

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    showToast(`${item.name} added to cart`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorTitle}>Couldn't load the menu</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadMenu()}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dayName = DAYS[new Date().getDay()];

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuCard item={item} onAddToCart={handleAddToCart} />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>
                  Happy {dayName}! 👋
                </Text>
                <Text style={styles.headerTitle}>
                  Intelligent Bistro
                </Text>
                <Text style={styles.headerSubtitle}>
                  Your smart restaurant assistant • {serverStatus === "online" ? "Online" : "Offline"}
                </Text>
              </View>
            </View>

            <View style={styles.searchBar}>
              <FontAwesome name="search" size={14} color={Colors.textTertiary} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="What are you craving?"
                placeholderTextColor={Colors.textTertiary}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <FontAwesome name="times-circle" size={16} color={Colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.aiCard}
              activeOpacity={0.8}
              onPress={() => router.push("/assistant")}
            >
              <View style={styles.aiCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.aiCardTitle}>🤖 Ask Bistro</Text>
                  <Text style={styles.aiCardDesc}>
                    Tell me what you are craving today.
                  </Text>
                  <Text style={styles.aiCardSubtitle}>
                    "Add fries and a lemonade"
                  </Text>
                </View>
                <View style={styles.aiCardBtn}>
                  <Text style={styles.aiCardBtnText}>Start ordering</Text>
                </View>
              </View>
            </TouchableOpacity>

            <CategoryFilter selected={category} onSelect={setCategory} />

            {category === "all" && popularItems.length > 0 && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Chef's Favorites</Text>
              </View>
            )}
            {category !== "all" && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <Text style={styles.sectionCount}>
                  {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyText}>
              Try selecting a different category
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />

      {toast && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslate }],
            },
          ]}
        >
          <View style={styles.toastContent}>
            <FontAwesome name="check-circle" size={16} color={Colors.success} />
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: Spacing.xxl + 20,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  greeting: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.text,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.sm,
  },
  searchInput: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
    paddingVertical: 0,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  aiCard: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm + 6,
    paddingVertical: Spacing.sm + 4,
    backgroundColor: Colors.primarySoft,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 48, 8, 0.1)",
  },
  aiCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm + 2,
  },
  aiCardTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 1,
  },
  aiCardDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  aiCardSubtitle: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontStyle: "italic",
  },
  aiCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 3,
    borderRadius: BorderRadius.full,
  },
  aiCardBtnText: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  sectionCount: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  errorMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.full,
  },
  retryButtonText: {
    ...Typography.button,
    color: Colors.textLight,
  },
  toast: {
    position: "absolute",
    bottom: Spacing.lg,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    ...Shadows.large,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  toastText: {
    ...Typography.bodySmall,
    color: Colors.textLight,
    fontWeight: "500",
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
