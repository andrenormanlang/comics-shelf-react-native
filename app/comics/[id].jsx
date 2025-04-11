import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getComics } from "../../utils/appwrite";
import { getOptimizedImageUrl } from "../../utils/cloudinary";

export default function ComicDetailScreen() {
  const { id } = useLocalSearchParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComic = async () => {
      try {
        setLoading(true);
        const comics = await getComics();
        const selectedComic = comics.find((comic) => comic.$id === id);
        if (!selectedComic) {
          throw new Error("Comic not found");
        }
        setComic(selectedComic);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComic();
  }, [id]);

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
      </View>
    );
  }

  if (!comic) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {comic.coverImage && (
          <Image
            source={{ uri: getOptimizedImageUrl(comic.coverImage, 600, 900) }}
            style={styles.coverImage}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{comic.title}</Text>
        <Text style={styles.status}>Status: {comic.status}</Text>
        {comic.status === "read" && comic.rating > 0 && (
          <Text style={styles.rating}>Rating: {comic.rating}/5</Text>
        )}
        {comic.description && (
          <Text style={styles.description}>{comic.description}</Text>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => Alert.alert("Edit functionality not implemented")}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => Alert.alert("Delete functionality not implemented")}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
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
    color: "#BB86FC",
    fontSize: 16,
  },
  imageContainer: {
    width: "100%",
    height: 500,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 16,
    backgroundColor: "rgba(30, 30, 30, 0.9)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  status: {
    fontSize: 16,
    color: "#BB86FC",
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    color: "#03DAC6",
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#E1E1E1",
    marginBottom: 16,
    lineHeight: 24,
    backgroundColor: "rgba(18, 18, 18, 0.6)",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#BB86FC",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: "#CF6679",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
