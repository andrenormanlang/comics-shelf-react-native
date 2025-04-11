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
        <View style={styles.imageContainer}>
          {item.coverImage && (
            <Image
              source={{ uri: getOptimizedImageUrl(item.coverImage, 300, 450) }}
              style={styles.coverImage}
              resizeMode="contain"
            />
          )}
        </View>
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
      <View style={styles.headerSpace}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

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
    backgroundColor: "transparent",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(18, 18, 18, 0.8)",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(18, 18, 18, 0.8)",
  },
  errorText: {
    color: "#BB86FC",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#BB86FC",
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  headerSpace: {
    height: 80,
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 0, // Removed padding to move logo all the way to the left
  },
  logo: {
    width: 200,
    height: "100%",
  },
  list: {
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  comicCard: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(30, 30, 30, 0.85)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderColor: "rgba(187, 134, 252, 0.3)",
    borderWidth: 1,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#121212",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(187, 134, 252, 0.2)",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  comicInfo: {
    padding: 12,
    backgroundColor: "rgba(18, 18, 18, 0.6)",
  },
  comicTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  comicStatus: {
    color: "#BB86FC",
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.9,
  },
  comicRating: {
    color: "#03DAC6",
    fontWeight: "bold",
    fontSize: 14,
    opacity: 0.9,
  },
});
