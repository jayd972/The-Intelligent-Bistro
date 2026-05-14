export const Colors = {
  primary: "#E85D2C",
  primaryLight: "#FF7A4D",
  primaryDark: "#C44A1E",
  secondary: "#1B1B1B",
  accent: "#F5A623",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceAlt: "#F2F2F2",
  text: "#1B1B1B",
  textSecondary: "#6B6B6B",
  textLight: "#FFFFFF",
  border: "#E5E5E5",
  error: "#D32F2F",
  success: "#388E3C",
  overlay: "rgba(0, 0, 0, 0.5)",
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  price: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
};

export const Shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};
