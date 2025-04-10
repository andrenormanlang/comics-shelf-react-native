import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { getComics } from "../../utils/appwrite";
import { getOptimizedImageUrl } from "../../utils/cloudinary";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;

export default function HomeScreen() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();

  const fetchComics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getComics();
      console.log("Fetched comics:", response); // Add logging to debug
      setComics(response.documents || []);
    } catch (err) {
      console.error("Error fetching comics:", err);
      setError("Failed to load comics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchComics();
    }
  }, [isFocused]);

  const renderComic = ({ item }) => (
    <TouchableOpacity
      style={[styles.comicCard, { width: CARD_WIDTH }]}
      onPress={() => {
        router.push({
          pathname: "/(tabs)/comic-detail",
          params: { ...item },
        });
      }}
    >
      {item.coverImage && (
        <Image
          source={{ uri: getOptimizedImageUrl(item.coverImage) }}
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchComics}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
}

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
