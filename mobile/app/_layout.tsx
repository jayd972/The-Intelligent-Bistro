import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Colors, Shadows } from "@/constants/theme";
import { CartProvider } from "@/context/CartContext";


export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

const bistroTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
  },
};

/** Max width for web preview so Chrome looks like a phone, not a stretched desktop layout */
const WEB_PHONE_MAX_WIDTH = 430;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  webOuter: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#E4E4E7",
    ...(Platform.OS === "web" ? { minHeight: "100vh" as any } : {}),
  },
  webPhone: {
    flex: 1,
    width: "100%",
    maxWidth: WEB_PHONE_MAX_WIDTH,
    backgroundColor: Colors.background,
    overflow: "hidden",
    ...Shadows.large,
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const appShell = (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="order-confirmation"
        options={{
          headerShown: false,
          presentation: "modal",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );

  return (
    <CartProvider>
      <ThemeProvider value={bistroTheme}>
        <StatusBar style="dark" />
        {Platform.OS === "web" ? (
          <View style={styles.webOuter}>
            <View style={styles.webPhone}>{appShell}</View>
          </View>
        ) : (
          <View style={styles.root}>{appShell}</View>
        )}
      </ThemeProvider>
    </CartProvider>
  );
}
