import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24; // 2 columns with padding

const HomeScreen = () => {
  const [comics] = useState([]); // This would be replaced with your storage solution

  const renderComic = ({ item }) => (
    <TouchableOpacity style={[styles.comicCard, { width: CARD_WIDTH }]}>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.comicInfo}>
        <Text style={styles.comicTitle}>{item.title}</Text>
        <Text style={styles.comicStatus}>Status: {item.status}</Text>
        {item.rating > 0 && (
          <Text style={styles.comicRating}>Rating: {item.rating}/5</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Comic Shelf</Text>
        <Link href="/add-comic" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Comic</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={comics}
        renderItem={renderComic}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  comicCard: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  comicInfo: {
    padding: 12,
  },
  comicTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  comicStatus: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
  comicRating: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

// Change default export to named export for Expo Router
export { HomeScreen as default };
