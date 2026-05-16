import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { useCart } from "@/context/CartContext";
import CartItemCard from "@/components/CartItemCard";

export default function CartScreen() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, tax, total } =
    useCart();
  const router = useRouter();

  const handleClearCart = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Remove all items from your cart?");
      if (confirmed) clearCart();
    } else {
      Alert.alert("Clear Cart", "Remove all items from your cart?", [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearCart },
      ]);
    }
  };

  const handlePlaceOrder = () => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
    const itemCount = items.length.toString();
    const orderTotal = total.toFixed(2);
    clearCart();
    router.push({
      pathname: "/order-confirmation",
      params: { total: orderTotal, itemCount, orderNumber },
    });
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrap}>
          <FontAwesome name="shopping-cart" size={32} color={Colors.textTertiary} />
        </View>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Add items from the menu to get started
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.push("/(tabs)")}
          activeOpacity={0.7}
        >
          <Text style={styles.browseButtonText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        )}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.itemCount}>
              {totalQty} item{totalQty !== 1 ? "s" : ""}
            </Text>
            <TouchableOpacity
              onPress={handleClearCart}
              activeOpacity={0.6}
            >
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax & fees</Text>
          <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={handlePlaceOrder}
          activeOpacity={0.85}
        >
          <Text style={styles.orderButtonText}>Place Order · ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: Spacing.md,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemCount: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: "600",
  },
  clearText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: "500",
  },
  summaryContainer: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.body,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  totalLabel: {
    ...Typography.h3,
    color: Colors.text,
    fontWeight: "700",
  },
  totalValue: {
    ...Typography.h2,
    color: Colors.text,
  },
  orderButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm + 6,
    alignItems: "center",
    justifyContent: "center",
  },
  orderButtonText: {
    ...Typography.button,
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 4,
    borderRadius: BorderRadius.full,
  },
  browseButtonText: {
    ...Typography.button,
    color: Colors.textLight,
  },
});
