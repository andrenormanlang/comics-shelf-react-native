import { View, Text, StyleSheet } from "react-native";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabList}>
        <TabTrigger
          name="index"
          href="/"
          style={({ focused }) => [
            styles.tabTrigger,
            focused && styles.tabTriggerFocused,
          ]}
        >
          {({ focused }) => (
            <View style={styles.tabContent}>
              <Ionicons
                name={focused ? "book" : "book-outline"}
                size={24}
                color={focused ? "#007AFF" : "gray"}
              />
              <Text style={[styles.tabText, focused && styles.tabTextFocused]}>
                Shelf
              </Text>
            </View>
          )}
        </TabTrigger>

        <TabTrigger
          name="add-comic"
          href="/add-comic"
          style={({ focused }) => [
            styles.tabTrigger,
            focused && styles.tabTriggerFocused,
          ]}
        >
          {({ focused }) => (
            <View style={styles.tabContent}>
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                size={24}
                color={focused ? "#007AFF" : "gray"}
              />
              <Text style={[styles.tabText, focused && styles.tabTextFocused]}>
                Add Comic
              </Text>
            </View>
          )}
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "white",
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabTrigger: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  tabTriggerFocused: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 8,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "gray",
  },
  tabTextFocused: {
    color: "#007AFF",
  },
});
