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
      console.log("Fetched comics:", response);

      if (Array.isArray(response)) {
        setComics(response);
      } else {
        console.error("Invalid response format:", response);
        setError("Failed to load comics");
      }
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

  const renderComic = ({ item }) => {
    if (!item) return null;

    return (
      <TouchableOpacity
        style={[styles.comicCard, { width: CARD_WIDTH }]}
        onPress={() => {
          if (item.$id) {
            router.push(`/comics/${item.$id}`);
          }
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
          <Text style={styles.comicTitle}>{item.title || "Untitled"}</Text>
          <Text style={styles.comicStatus}>
            Status: {item.status || "Unknown"}
          </Text>
          {item.rating > 0 && (
            <Text style={styles.comicRating}>Rating: {item.rating}/5</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
      <View style={styles.headerSpace}>{/* Space reserved for logo */}</View>

      <FlatList
        data={comics}
        renderItem={renderComic}
        keyExtractor={(item) => item.$id}
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
  headerSpace: {
    height: 50,
    marginBottom: 24, // Increased from 16 to 24
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
