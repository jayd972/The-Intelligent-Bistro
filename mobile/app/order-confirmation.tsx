import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from "@/constants/theme";

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    total: string;
    itemCount: string;
    orderNumber: string;
  }>();

  const checkScale = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(checkScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 6,
        delay: 200,
      }),
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideUp, {
          toValue: 0,
          useNativeDriver: true,
          tension: 60,
          friction: 10,
        }),
      ]),
    ]).start();
  }, [checkScale, fadeIn, slideUp]);

  const [estimatedTime] = useState(() => Math.floor(Math.random() * 11) + 15);

  const statusSteps = [
    { label: "Order placed", icon: "check" as const, active: true },
    { label: "Preparing", icon: "cutlery" as const, active: false },
    { label: "Ready", icon: "shopping-bag" as const, active: false },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Animated.View
        style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}
      >
        <FontAwesome name="check" size={40} color={Colors.textLight} />
      </Animated.View>

      <Animated.View
        style={[
          styles.details,
          { opacity: fadeIn, transform: [{ translateY: slideUp }] },
        ]}
      >
        <Text style={styles.title}>Order confirmed!</Text>
        <Text style={styles.subtitle}>
          Thank you for ordering from Intelligent Bistro
        </Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Order #</Text>
            <Text style={styles.cardValueBold}>{params.orderNumber}</Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Items</Text>
            <Text style={styles.cardValue}>
              {params.itemCount} item{Number(params.itemCount) !== 1 ? "s" : ""}
            </Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Total</Text>
            <Text style={styles.cardValueBold}>${params.total}</Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Est. time</Text>
            <Text style={styles.cardValue}>
              {estimatedTime}–{estimatedTime + 5} min
            </Text>
          </View>
        </View>

        <View style={styles.statusSection}>
          {statusSteps.map((step, index) => (
            <View key={step.label} style={styles.statusStepRow}>
              <View style={styles.statusStep}>
                <View
                  style={[
                    styles.statusDot,
                    step.active && styles.statusDotActive,
                  ]}
                >
                  <FontAwesome
                    name={step.icon}
                    size={step.active ? 10 : 9}
                    color={step.active ? Colors.textLight : Colors.textTertiary}
                  />
                </View>
                <Text
                  style={[
                    styles.statusText,
                    step.active && styles.statusTextActive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
              {index < statusSteps.length - 1 && (
                <View
                  style={[
                    styles.statusLine,
                    step.active && styles.statusLineActive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/(tabs)")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Back to Menu</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: Spacing.xxl,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  details: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm + 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  cardLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  cardValue: {
    ...Typography.body,
    color: Colors.text,
  },
  cardValueBold: {
    ...Typography.body,
    fontWeight: "700",
    color: Colors.text,
  },
  statusSection: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  statusStepRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  statusStep: {
    alignItems: "center",
    gap: Spacing.xs + 2,
    flex: 0,
    minWidth: 70,
  },
  statusDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  statusDotActive: {
    backgroundColor: Colors.success,
  },
  statusLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.borderLight,
    marginTop: 13,
    marginHorizontal: Spacing.xs,
  },
  statusLineActive: {
    backgroundColor: Colors.success,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: "center",
  },
  statusTextActive: {
    color: Colors.success,
    fontWeight: "700",
  },
  primaryButton: {
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm + 6,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "700",
  },
});
