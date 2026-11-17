import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import {
  recipeCategoryLabel,
  recipeCuisineLabel,
  recipeName,
} from "@/localization/recipes";

export function RecipeCard({ recipe }) {
  const theme = useTheme();
  const category = recipeCategoryLabel(recipe);
  const cuisine = recipeCuisineLabel(recipe);
  const name = recipeName(recipe.name);

  return (
    <Link
      href={{ pathname: "/resep/[id]", params: { id: String(recipe.id) } }}
      asChild
    >
      <Pressable
        accessibilityLabel={"Buka resep " + name}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View
          style={[styles.card, { backgroundColor: theme.backgroundElement }]}
        >
          <Image
            source={{ uri: recipe.image }}
            style={styles.image}
            contentFit="cover"
            cachePolicy="disk"
          />
          <View style={styles.info}>
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.backgroundSelected },
              ]}
            >
              <ThemedText
                type="smallBold"
                themeColor="accent"
                style={styles.badgeLabel}
              >
                {cuisine}
              </ThemedText>
            </View>
            <ThemedText style={styles.name}>{name}</ThemedText>
            {category ? (
              <ThemedText type="small" themeColor="textSecondary">
                {category}
              </ThemedText>
            ) : null}
            <View style={styles.bottom}>
              {typeof recipe.cookTimeMinutes === "number" && (
                <ThemedText type="small" themeColor="textSecondary">
                  {recipe.cookTimeMinutes} menit memasak
                </ThemedText>
              )}
              <ThemedText aria-hidden style={styles.arrow} themeColor="accent">
                ↗
              </ThemedText>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressable: { flex: 1 },
  pressed: { opacity: 0.79 },
  card: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1.35,
    backgroundColor: "#D8C9B5",
  },
  info: { padding: 13, gap: 4, flex: 1 },
  badge: {
    alignSelf: "flex-start",
    maxWidth: "100%",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 3,
  },
  badgeLabel: { fontSize: 11, lineHeight: 15 },
  name: { fontSize: 17, fontWeight: "700", lineHeight: 22, flex: 1 },
  bottom: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  arrow: { marginLeft: "auto", fontSize: 19, lineHeight: 23 },
});
