import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60_000, gcTime: 15 * 60_000, retry: 1 },
  },
});

export default function RootLayout() {
  const scheme = useColorScheme();
  const base = scheme === "dark" ? DarkTheme : DefaultTheme;
  const palette = Colors[scheme === "dark" ? "dark" : "light"];
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      background: palette.background,
      card: palette.backgroundElement,
      text: palette.text,
      border: palette.border,
      primary: palette.accent,
    },
  };
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="resep/[id]"
            options={{ title: "Detail resep", headerBackTitle: "Resep" }}
          />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
