export const Colors = {
  primary: "#FF3008",
  primaryLight: "#FF6B4A",
  primaryDark: "#D42600",
  primarySoft: "rgba(255, 48, 8, 0.06)",
  secondary: "#191919",
  accent: "#FFC043",
  accentSoft: "rgba(255, 192, 67, 0.12)",
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F5F5",
  surfaceElevated: "#FFFFFF",
  text: "#191919",
  textSecondary: "#767676",
  textTertiary: "#AFAFAF",
  textLight: "#FFFFFF",
  border: "#E8E8E8",
  borderLight: "#F0F0F0",
  error: "#D4111E",
  errorSoft: "rgba(212, 17, 30, 0.08)",
  success: "#00833E",
  successSoft: "rgba(0, 131, 62, 0.08)",
  overlay: "rgba(0, 0, 0, 0.5)",
  gradientStart: "#FF3008",
  gradientEnd: "#FF6B4A",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 26,
    fontWeight: "800" as const,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 22,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 16,
    fontWeight: "600" as const,
    letterSpacing: -0.1,
  },
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  button: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  price: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  label: {
    fontSize: 12,
    fontWeight: "600" as const,
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
  },
};

export const Shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
};
