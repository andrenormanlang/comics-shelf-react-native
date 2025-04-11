import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "index") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "add-comic") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Shelf" }} />
      <Tabs.Screen name="add-comic" options={{ title: "Add Comic" }} />
    </Tabs>
  );
}
