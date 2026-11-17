import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

export function RecipeFilterRow({ label, options, value, onChange }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const selectedLabel = value || "Semua";

  if (options.length === 0) return null;

  return (
    <View style={styles.group}>
      <ThemedText accessibilityRole="header" type="smallBold">
        {label}
      </ThemedText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label + ": " + selectedLabel}
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}
        style={({ pressed }) => [
          styles.trigger,
          {
            borderColor: expanded || value ? theme.accent : theme.border,
            backgroundColor: pressed
              ? theme.backgroundSelected
              : theme.backgroundElement,
          },
        ]}
      >
        <ThemedText
          type="smallBold"
          themeColor={value ? "accent" : "text"}
          style={styles.text}
        >
          {selectedLabel}
        </ThemedText>
        <ThemedText aria-hidden themeColor="accent">
          {expanded ? "▴" : "▾"}
        </ThemedText>
      </Pressable>

      {expanded && (
        <ScrollView
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          style={[
            styles.menu,
            {
              borderColor: theme.border,
              backgroundColor: theme.backgroundElement,
            },
          ]}
          contentContainerStyle={styles.menuContent}
        >
          {["", ...options].map((option) => {
            const selected = value === option;
            return (
              <Pressable
                key={option || "all"}
                accessibilityRole="button"
                accessibilityLabel={label + ": " + (option || "Semua")}
                accessibilityState={{ selected }}
                onPress={() => {
                  setExpanded(false);
                  onChange(option);
                }}
                style={({ pressed }) => [
                  styles.option,
                  (selected || pressed) && {
                    backgroundColor: theme.backgroundSelected,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  themeColor={selected ? "accent" : "text"}
                  style={styles.text}
                >
                  {option || "Semua"}
                </ThemedText>
                {selected && (
                  <ThemedText aria-hidden themeColor="accent">
                    ✓
                  </ThemedText>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 6 },
  trigger: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  text: { flex: 1 },
  menu: { maxHeight: 212, borderWidth: 1, borderRadius: 13 },
  menuContent: { padding: 4 },
  option: {
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
