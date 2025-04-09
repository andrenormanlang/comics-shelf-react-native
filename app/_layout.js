import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "(tabs)/index") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "(tabs)/add-comic") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tabs.Screen name="(tabs)/index" options={{ title: "Shelf" }} />
      <Tabs.Screen name="(tabs)/add-comic" options={{ title: "Add Comic" }} />
    </Tabs>
  );
}
