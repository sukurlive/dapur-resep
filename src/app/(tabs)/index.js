import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link, useFocusEffect } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { recipesQuery } from "@/api/recipes";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeLoading, RecipeStatus } from "@/components/recipe-status";
import { ThemedText } from "@/components/themed-text";
import { Fonts, MaxContentWidth } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { pickRandomRecipes } from "@/utils/random-recipes";

export default function HomeScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const query = useQuery(recipesQuery(""));
  const recipes = query.data;
  const [featuredIds, setFeaturedIds] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (recipes) {
        setFeaturedIds(pickRandomRecipes(recipes).map((recipe) => recipe.id));
      }
    }, [recipes]),
  );

  const featured = featuredIds
    .map((id) => recipes?.find((recipe) => recipe.id === id))
    .filter(Boolean);
  const hero = featured[0];
  const wide = width >= 640;

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.screen, { backgroundColor: theme.backgroundElement }]}
    >
      <View style={[styles.brand, { borderColor: theme.border }]}>
        <View
          style={[
            styles.brandIcon,
            { backgroundColor: theme.backgroundSelected },
          ]}
        >
          <SymbolView
            aria-hidden
            name={{
              ios: "fork.knife",
              android: "restaurant",
              web: "restaurant",
            }}
            size={23}
            tintColor={theme.accent}
          />
        </View>
        <ThemedText accessibilityRole="header" style={styles.brandName}>
          Dapur Resep
        </ThemedText>
      </View>

      <ScrollView
        style={[styles.screen, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View
          style={[
            styles.hero,
            wide && styles.heroWide,
            {
              borderColor: theme.border,
              backgroundColor: theme.backgroundElement,
            },
          ]}
        >
          {hero && (
            <Image
              source={{ uri: hero.image }}
              style={wide ? styles.heroImageWide : styles.heroImage}
              contentFit="cover"
              cachePolicy="disk"
            />
          )}
          <View style={styles.intro}>
            <ThemedText
              accessibilityRole="header"
              type="title"
              style={styles.title}
            >
              Mau masak apa hari ini?
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.description}>
              Temukan resep dari bahan yang ada di dapur, lalu ikuti langkah
              memasaknya.
            </ThemedText>
            <Link href="/kategori" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.action,
                  {
                    backgroundColor: theme.selected,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <ThemedText type="smallBold" themeColor="onSelected">
                  Jelajahi resep
                </ThemedText>
                <ThemedText
                  aria-hidden
                  type="smallBold"
                  themeColor="onSelected"
                >
                  →
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>

        <View style={styles.feature}>
          <ThemedText accessibilityRole="header" style={styles.heading}>
            Resep Pilihan
          </ThemedText>
          {query.isPending && <RecipeLoading />}
          {query.isError && (
            <RecipeStatus
              message={
                hero
                  ? "Pembaruan gagal. Menampilkan data tersimpan."
                  : "Resep gagal dimuat. Periksa koneksi internet."
              }
              onRetry={() => void query.refetch()}
            />
          )}
          {featured.length > 0 && (
            <View style={styles.grid}>
              {featured.map((recipe) => (
                <View
                  key={recipe.id}
                  style={wide ? styles.cellWide : styles.cell}
                >
                  <RecipeCard recipe={recipe} />
                </View>
              ))}
            </View>
          )}
          {query.isSuccess && recipes.length === 0 && (
            <RecipeStatus message="Belum ada resep." />
          )}
        </View>

        <View
          style={[
            styles.explore,
            {
              backgroundColor: theme.backgroundSelected,
              borderColor: theme.border,
            },
          ]}
        >
          <ThemedText accessibilityRole="header" style={styles.heading}>
            Punya bahan di rumah?
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            Buka Kategori dan pilih mode Bahan. Coba cari ayam, tomat, atau
            bawang putih.
          </ThemedText>
          <Link href="/kategori" asChild>
            <Pressable style={styles.exploreLink}>
              <ThemedText type="smallBold" themeColor="accent">
                Buka pencarian →
              </ThemedText>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 23,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  brandIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontFamily: Fonts.serif,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: "700",
  },
  hero: { borderWidth: 1, borderRadius: 23, overflow: "hidden" },
  heroWide: { flexDirection: "row-reverse", alignItems: "stretch" },
  heroImage: { width: "100%", height: 184, backgroundColor: "#DEB994" },
  heroImageWide: { flex: 1, minHeight: 245, backgroundColor: "#DEB994" },
  intro: { flex: 1, padding: 19, justifyContent: "center", gap: 11 },
  title: { fontFamily: Fonts.serif, fontSize: 34, lineHeight: 39 },
  description: { fontSize: 15, lineHeight: 23 },
  action: {
    alignSelf: "flex-start",
    minHeight: 46,
    borderRadius: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  feature: { gap: 12 },
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  cell: { width: "48.4%" },
  cellWide: { width: "24%" },
  explore: { borderRadius: 17, borderWidth: 1, padding: 16, gap: 6 },
  exploreLink: {
    minHeight: 44,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
});
