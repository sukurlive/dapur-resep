import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

export function RecipeLoading() {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Memuat resep"
      style={styles.box}
    >
      <ActivityIndicator />
      <ThemedText>Memuat resep…</ThemedText>
    </View>
  );
}

export function RecipeStatus({ message, onRetry }) {
  const theme = useTheme();
  return (
    <View style={styles.box}>
      <ThemedText accessibilityLiveRegion="polite" style={styles.text}>
        {message}
      </ThemedText>
      {onRetry && (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={[styles.button, { backgroundColor: theme.backgroundSelected }]}
        >
          <ThemedText type="smallBold">Coba lagi</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  text: { textAlign: "center" },
  button: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
});
