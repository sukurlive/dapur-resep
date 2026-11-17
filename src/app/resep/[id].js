import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link, useCanGoBack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { recipeQuery } from "@/api/recipes";
import { RecipeLoading, RecipeStatus } from "@/components/recipe-status";
import { ThemedText } from "@/components/themed-text";
import { Fonts, MaxContentWidth } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  recipeCategoryLabel,
  recipeCuisineLabel,
  recipeIngredient,
  recipeInstruction,
  recipeName,
} from "@/localization/recipes";

export default function RecipeDetailScreen() {
  const canGoBack = useCanGoBack();
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const recipeId = Number(id);
  const query = useQuery(recipeQuery(recipeId));

  if (!Number.isSafeInteger(recipeId) || recipeId < 1) {
    return <RecipeStatus message="ID resep tidak valid." />;
  }
  if (query.isPending) return <RecipeLoading />;
  if (!query.data) {
    return (
      <RecipeStatus
        message="Detail resep gagal dimuat."
        onRetry={() => void query.refetch()}
      />
    );
  }

  const recipe = query.data;
  const category = recipeCategoryLabel(recipe);
  const cuisine = recipeCuisineLabel(recipe);
  const name = recipeName(recipe.name);
  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={[styles.screen, { backgroundColor: theme.background }]}
    >
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        {!canGoBack && (
          <Link href="/kategori" style={{ color: theme.accent }}>
            ‹ Semua resep
          </Link>
        )}
        {query.isError && (
          <RecipeStatus
            message="Pembaruan gagal. Menampilkan data tersimpan."
            onRetry={() => void query.refetch()}
          />
        )}
        <Image
          accessible
          accessibilityLabel={name}
          source={{ uri: recipe.image }}
          style={styles.photo}
          contentFit="cover"
          cachePolicy="disk"
        />
        <View style={styles.intro}>
          <View style={styles.metadata}>
            <ThemedText type="smallBold" themeColor="accent">
              {cuisine}
            </ThemedText>
            {category ? (
              <ThemedText type="small" themeColor="textSecondary">
                {category}
              </ThemedText>
            ) : null}
            {typeof recipe.cookTimeMinutes === "number" && (
              <ThemedText type="small" themeColor="textSecondary">
                {recipe.cookTimeMinutes} menit memasak
              </ThemedText>
            )}
          </View>
          <ThemedText
            accessibilityRole="header"
            type="subtitle"
            style={styles.title}
          >
            {name}
          </ThemedText>
        </View>

        <View
          style={[
            styles.ingredients,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
          ]}
        >
          <ThemedText accessibilityRole="header" style={styles.heading}>
            Bahan-bahan
          </ThemedText>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.line}>
              <View style={[styles.dot, { backgroundColor: theme.accent }]} />
              <ThemedText style={styles.lineText}>
                {recipeIngredient(ingredient)}
              </ThemedText>
            </View>
          ))}
        </View>
        <View style={styles.steps}>
          <ThemedText accessibilityRole="header" style={styles.heading}>
            Langkah memasak
          </ThemedText>
          {recipe.instructions.map((step, index) => (
            <View
              key={index}
              style={[styles.step, { borderBottomColor: theme.border }]}
            >
              <View
                style={[
                  styles.stepNumber,
                  { backgroundColor: theme.backgroundSelected },
                ]}
              >
                <ThemedText type="smallBold" themeColor="accent">
                  {index + 1}
                </ThemedText>
              </View>
              <ThemedText style={styles.lineText}>
                {recipeInstruction(step)}
              </ThemedText>
            </View>
          ))}
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
    padding: 18,
    paddingBottom: 24,
    gap: 22,
  },
  photo: {
    width: "100%",
    aspectRatio: 1.45,
    maxHeight: 380,
    borderRadius: 19,
    backgroundColor: "#D8C9B5",
  },
  intro: { gap: 7 },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 14,
  },
  title: { fontFamily: Fonts.serif, fontSize: 33, lineHeight: 40 },
  ingredients: { gap: 10, padding: 17, borderRadius: 17, borderWidth: 1 },
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 23,
    lineHeight: 31,
    fontWeight: "700",
  },
  line: { flexDirection: "row", alignItems: "flex-start", gap: 11 },
  lineText: { flex: 1, fontSize: 15, lineHeight: 23 },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  steps: { gap: 2 },
  step: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
