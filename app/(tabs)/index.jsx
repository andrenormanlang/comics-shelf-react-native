import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { getComics } from "../utils/appwrite";

const HomeScreen = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComics();
  }, []);

  const fetchComics = async () => {
    try {
      setLoading(true);
      const response = await getComics();
      setComics(response.documents);
    } catch (err) {
      setError("Failed to load comics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderComic = ({ item }) => (
    <TouchableOpacity style={styles.comicCard}>
      <Text style={styles.comicTitle}>{item.title}</Text>
      <Text style={styles.comicStatus}>Status: {item.status}</Text>
      {item.rating > 0 && (
        <Text style={styles.comicRating}>Rating: {item.rating}/5</Text>
      )}
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
        keyExtractor={(item) => item.$id}
        style={styles.list}
        refreshing={loading}
        onRefresh={fetchComics}
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
  comicCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  comicTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  comicStatus: {
    color: "#666",
    marginBottom: 4,
  },
  comicRating: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default HomeScreen;
