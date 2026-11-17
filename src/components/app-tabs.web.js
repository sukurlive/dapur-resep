import { Image } from "expo-image";
import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  useTabTrigger,
} from "expo-router/ui";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { MaxContentWidth } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

function TabLabel({ name, label, icon }) {
  const theme = useTheme();
  const { trigger } = useTabTrigger({ name });
  const selected = trigger?.isFocused;

  return (
    <View style={styles.label}>
      <View
        style={[
          styles.icon,
          selected && { backgroundColor: theme.backgroundSelected },
        ]}
      >
        <Image
          source={icon}
          style={styles.image}
          tintColor={selected ? theme.accent : theme.textSecondary}
        />
      </View>
      <ThemedText
        type="smallBold"
        themeColor={selected ? "accent" : "textSecondary"}
      >
        {label}
      </ThemedText>
    </View>
  );
}

export default function AppTabs() {
  const theme = useTheme();

  return (
    <Tabs style={styles.screen}>
      <TabSlot style={styles.screen} />
      <TabList asChild>
        <SafeAreaView
          edges={["bottom", "left", "right"]}
          style={[
            styles.bar,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
          ]}
        >
          <TabTrigger name="index" href="/" style={styles.trigger}>
            <TabLabel
              name="index"
              label="Beranda"
              icon={require("@/assets/images/tabIcons/home.png")}
            />
          </TabTrigger>
          <TabTrigger name="kategori" href="/kategori" style={styles.trigger}>
            <TabLabel
              name="kategori"
              label="Kategori"
              icon={require("@/assets/images/tabIcons/explore.png")}
            />
          </TabTrigger>
        </SafeAreaView>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: 0 },
  bar: { borderTopWidth: 1, flexDirection: "row", justifyContent: "center" },
  trigger: {
    flex: 1,
    maxWidth: MaxContentWidth / 2,
    minHeight: 59,
    justifyContent: "center",
  },
  label: { alignItems: "center", gap: 1 },
  icon: {
    width: 58,
    height: 29,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: 20, height: 20 },
});
