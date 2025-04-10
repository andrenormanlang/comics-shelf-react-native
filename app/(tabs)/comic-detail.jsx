import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { updateComic, deleteComic } from "../../utils/appwrite";
import { getOptimizedImageUrl } from "../../utils/cloudinary";

export default function ComicDetailScreen() {
  const params = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comic, setComic] = useState(params);
  const [editedComic, setEditedComic] = useState({
    title: params.title,
    status: params.status,
    rating: params.rating?.toString() || "0",
  });

  const handleDelete = () => {
    Alert.alert("Delete Comic", "Are you sure you want to delete this comic?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteComic(params.$id);
            router.back();
          } catch (error) {
            console.error("Error deleting comic:", error);
            Alert.alert("Error", "Failed to delete comic");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updatedComic = await updateComic(params.$id, {
        ...editedComic,
        rating: parseInt(editedComic.rating),
        updatedAt: new Date().toISOString(),
      });
      setComic(updatedComic);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comic:", error);
      Alert.alert("Error", "Failed to update comic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {comic.coverImage && (
        <Image
          source={{ uri: getOptimizedImageUrl(comic.coverImage, 400, 600) }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={editedComic.title}
              onChangeText={(text) =>
                setEditedComic((prev) => ({ ...prev, title: text }))
              }
              placeholder="Comic Title"
            />
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  editedComic.status === "read" && styles.statusButtonActive,
                ]}
                onPress={() =>
                  setEditedComic((prev) => ({ ...prev, status: "read" }))
                }
              >
                <Text style={styles.statusButtonText}>Read</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  editedComic.status === "to-read" && styles.statusButtonActive,
                ]}
                onPress={() =>
                  setEditedComic((prev) => ({ ...prev, status: "to-read" }))
                }
              >
                <Text style={styles.statusButtonText}>To Read</Text>
              </TouchableOpacity>
            </View>
            {editedComic.status === "read" && (
              <TextInput
                style={styles.input}
                value={editedComic.rating}
                onChangeText={(text) =>
                  setEditedComic((prev) => ({ ...prev, rating: text }))
                }
                placeholder="Rating (1-5)"
                keyboardType="numeric"
              />
            )}
          </>
        ) : (
          <>
            <Text style={styles.title}>{comic.title}</Text>
            <Text style={styles.status}>Status: {comic.status}</Text>
            {comic.status === "read" && comic.rating > 0 && (
              <Text style={styles.rating}>Rating: {comic.rating}/5</Text>
            )}
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => {
              if (isEditing) {
                handleUpdate();
              } else {
                setIsEditing(true);
              }
            }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Loading..." : isEditing ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>

          {!isEditing && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          )}

          {isEditing && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setIsEditing(false);
                setEditedComic({
                  title: comic.title,
                  status: comic.status,
                  rating: comic.rating?.toString() || "0",
                });
              }}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  coverImage: {
    width: "100%",
    height: 400,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  cancelButton: {
    backgroundColor: "#8E8E93",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  statusButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  statusButtonText: {
    color: "#666",
  },
});
