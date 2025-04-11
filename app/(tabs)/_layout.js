import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HalftoneBackground from "../../components/HalftoneBackground";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <HalftoneBackground />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarStyle: {
            backgroundColor: "#1E1E1E",
            borderTopColor: "#333",
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          },
          headerStyle: {
            backgroundColor: "#1E1E1E",
          },
          headerTitleStyle: {
            color: "#fff",
          },
          contentStyle: { backgroundColor: "transparent" },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "index") {
              iconName = focused ? "book" : "book-outline";
            } else if (route.name === "add-comic") {
              iconName = focused ? "add-circle" : "add-circle-outline";
            }

            return (
              <View style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused
              ]}>
                <Ionicons 
                  name={iconName} 
                  size={size} 
                  color={color}
                  style={styles.icon}
                />
              </View>
            );
          },
          tabBarActiveTintColor: "#BB86FC",
          tabBarInactiveTintColor: "#999",
          tabBarLabel: ({ focused, children }) => (
            <Text style={[
              styles.tabLabel,
              focused && styles.tabLabelFocused
            ]}>
              {children}
            </Text>
          ),
          tabBarButton: (props) => (
            <View style={styles.tabButton}>
              <TouchableOpacity {...props} />
            </View>
          ),
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Shelf",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="add-comic"
          options={{
            title: "Add Comic",
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    transform: [{ scale: 1 }],
  },
  iconContainerFocused: {
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    transform: [{ scale: 1.1 }],
  },
  icon: {
    transform: [{ scale: 1 }],
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#999",
    opacity: 0.8,
  },
  tabLabelFocused: {
    color: "#BB86FC",
    opacity: 1,
    fontWeight: "600",
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
