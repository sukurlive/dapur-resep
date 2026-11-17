import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

export function RecipePagination({ page, pageCount, onChange }) {
  const theme = useTheme();
  const buttons = [
    { label: "Sebelumnya", target: page - 1, disabled: page === 1 },
    { label: "Berikutnya", target: page + 1, disabled: page === pageCount },
  ];

  return (
    <View style={[styles.footer, { borderColor: theme.border }]}>
      <ThemedText
        accessibilityLiveRegion="polite"
        themeColor="textSecondary"
        type="small"
      >
        Halaman {page} dari {pageCount}
      </ThemedText>
      <View style={styles.buttons}>
        {buttons.map(({ label, target, disabled }) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => onChange(target)}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
              (disabled || pressed) && styles.muted,
            ]}
          >
            <ThemedText
              type="smallBold"
              themeColor={disabled ? "textSecondary" : "accent"}
            >
              {label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 8,
    gap: 10,
    alignItems: "center",
  },
  buttons: { flexDirection: "row", width: "100%", maxWidth: 380, gap: 10 },
  button: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  muted: { opacity: 0.6 },
});
