import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { filterByIngredient, recipesQuery } from "@/api/recipes";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeFilterRow } from "@/components/recipe-filter-row";
import { RecipePagination } from "@/components/recipe-pagination";
import { RecipeLoading, RecipeStatus } from "@/components/recipe-status";
import { ThemedText } from "@/components/themed-text";
import { Fonts, MaxContentWidth } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  mergeNameMatches,
  recipeCategories,
  recipeCuisineLabel,
} from "@/localization/recipes";
import { paginateRecipes } from "@/utils/recipe-pagination";

const modes = [
  { value: "name", label: "Nama resep" },
  { value: "ingredient", label: "Bahan" },
];

export default function RecipesScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const columns = width >= 370 ? 2 : 1;
  const list = useRef(null);
  const [requestedPage, setRequestedPage] = useState(1);
  const [category, setCategory] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [text, setText] = useState("");
  const [mode, setMode] = useState("name");
  const [debouncedText, setDebouncedText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const keyword = text.trim().toLowerCase();
  const byName = mode === "name";

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedText(keyword), 350);
    return () => clearTimeout(timer);
  }, [keyword]);

  const query = useQuery(recipesQuery(byName && keyword ? debouncedText : ""));
  const catalog = useQuery(recipesQuery(""));
  const allRecipes = catalog.data ?? [];
  const categories = [...new Set(allRecipes.flatMap(recipeCategories))].sort();
  const cuisines = [...new Set(allRecipes.map(recipeCuisineLabel))].sort();
  const recipes = query.data ?? [];
  const matching = !keyword
    ? recipes
    : byName
      ? mergeNameMatches(recipes, allRecipes, debouncedText)
      : filterByIngredient(recipes, keyword);
  const visible = matching.filter(
    (recipe) =>
      (!category || recipeCategories(recipe).includes(category)) &&
      (!cuisine || recipeCuisineLabel(recipe) === cuisine),
  );
  const pending =
    query.isPending ||
    (byName && !!keyword && (keyword !== debouncedText || catalog.isPending));
  const { page, pageCount, start, items } = paginateRecipes(
    visible,
    requestedPage,
  );

  function changePage(nextPage) {
    setRequestedPage(nextPage);
    list.current?.scrollToOffset({ offset: 0, animated: false });
  }

  function changeSearch(value) {
    setText(value);
    setRequestedPage(1);
  }

  async function refresh() {
    setRefreshing(true);
    try {
      if (byName && debouncedText) {
        await Promise.all([query.refetch(), catalog.refetch()]);
      } else {
        await query.refetch();
      }
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.safe, { backgroundColor: theme.background }]}
    >
      <FlatList
        ref={list}
        key={columns}
        style={styles.content}
        contentContainerStyle={styles.list}
        columnWrapperStyle={columns > 1 ? styles.row : undefined}
        numColumns={columns}
        data={pending ? [] : items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={columns > 1 ? styles.cell : styles.fullCell}>
            <RecipeCard recipe={item} />
          </View>
        )}
        keyboardShouldPersistTaps="handled"
        refreshing={refreshing}
        onRefresh={refresh}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText
              accessibilityRole="header"
              type="title"
              style={styles.title}
            >
              Kategori Resep
            </ThemedText>
            <View
              style={[
                styles.search,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <ThemedText
                aria-hidden
                themeColor="accent"
                style={styles.searchIcon}
              >
                ⌕
              </ThemedText>
              <TextInput
                accessibilityLabel={
                  byName ? "Cari nama resep" : "Cari bahan makanan"
                }
                value={text}
                onChangeText={changeSearch}
                autoCapitalize="none"
                returnKeyType="search"
                placeholder={
                  byName
                    ? "Cari resep, misalnya pizza"
                    : "Cari bahan, misalnya bawang putih"
                }
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text }]}
              />
              {text !== "" && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Hapus pencarian"
                  onPress={() => changeSearch("")}
                  style={styles.clear}
                >
                  <ThemedText
                    themeColor="textSecondary"
                    style={styles.clearText}
                  >
                    ×
                  </ThemedText>
                </Pressable>
              )}
            </View>
            <View
              style={[
                styles.modes,
                { backgroundColor: theme.backgroundSelected },
              ]}
            >
              {modes.map(({ value, label }) => {
                const selected = mode === value;
                return (
                  <Pressable
                    key={value}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      setMode(value);
                      setRequestedPage(1);
                    }}
                    style={[
                      styles.pill,
                      selected && { backgroundColor: theme.selected },
                    ]}
                  >
                    <ThemedText
                      type="smallBold"
                      themeColor={selected ? "onSelected" : "text"}
                    >
                      {label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
            <RecipeFilterRow
              label="Kategori"
              options={categories}
              value={category}
              onChange={(value) => {
                setCategory(value);
                setRequestedPage(1);
              }}
            />
            <RecipeFilterRow
              label="Wilayah"
              options={cuisines}
              value={cuisine}
              onChange={(value) => {
                setCuisine(value);
                setRequestedPage(1);
              }}
            />
            {pending && <RecipeLoading />}
            {!pending && (query.isError || catalog.isError) && (
              <RecipeStatus
                message={
                  query.data || catalog.data
                    ? "Pembaruan gagal. Menampilkan data tersimpan."
                    : "Resep gagal dimuat. Periksa koneksi internet."
                }
                onRetry={() => void refresh()}
              />
            )}
            {!pending && visible.length > 0 && (
              <View style={styles.results}>
                <ThemedText accessibilityRole="header" style={styles.heading}>
                  {keyword
                    ? "Hasil pencarian"
                    : category || cuisine || "Semua resep"}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {start + 1}–{start + items.length} dari {visible.length}
                </ThemedText>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          !pending && pageCount > 1 ? (
            <RecipePagination
              page={page}
              pageCount={pageCount}
              onChange={changePage}
            />
          ) : undefined
        }
        ListEmptyComponent={
          !pending &&
          !query.isError &&
          !catalog.isError &&
          visible.length === 0 ? (
            <RecipeStatus message="Tidak ada resep yang cocok." />
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
  },
  list: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 24 },
  header: { gap: 13 },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 42,
    lineHeight: 52,
    marginBottom: 2,
  },
  search: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
  },
  searchIcon: { marginLeft: 14, fontSize: 24, lineHeight: 27 },
  input: { height: 50, flex: 1, paddingHorizontal: 10, fontSize: 16 },
  clear: {
    width: 44,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: { fontSize: 23, lineHeight: 26 },
  modes: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 13,
    marginBottom: 5,
    gap: 4,
  },
  pill: {
    flex: 1,
    borderRadius: 10,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  results: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    columnGap: 12,
    marginBottom: 12,
    marginTop: 2,
  },
  heading: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
  },
  row: { gap: 12 },
  cell: { flexBasis: 0, flexGrow: 1, maxWidth: "50%", marginBottom: 12 },
  fullCell: { marginBottom: 12 },
});
