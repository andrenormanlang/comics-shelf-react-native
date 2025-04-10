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
import {
  getOptimizedImageUrl,
  uploadToCloudinary,
} from "../../utils/cloudinary";
import * as ImagePicker from "expo-image-picker";

export default function ComicDetailScreen() {
  const { id, ...params } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comic, setComic] = useState({
    ...params,
    $id: id,
    rating: parseInt(params.rating) || 0,
  });
  const [editedComic, setEditedComic] = useState({
    title: params.title,
    status: params.status,
    rating: params.rating?.toString() || "0",
    coverImage: params.coverImage,
  });
  const [newImage, setNewImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to upload images.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setNewImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Comic", "Are you sure you want to delete this comic?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteComic(id);
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

      let coverImage = editedComic.coverImage;
      if (newImage) {
        coverImage = await uploadToCloudinary(newImage);
      }

      const updatedComic = await updateComic(id, {
        ...editedComic,
        coverImage,
        rating: parseInt(editedComic.rating),
        updatedAt: new Date().toISOString(),
      });
      setComic(updatedComic);
      setNewImage(null);
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
      {isEditing ? (
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          {newImage ? (
            <Image
              source={{ uri: newImage }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : comic.coverImage ? (
            <Image
              source={{ uri: getOptimizedImageUrl(comic.coverImage, 400, 600) }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Tap to add cover image</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        comic.coverImage && (
          <Image
            source={{ uri: getOptimizedImageUrl(comic.coverImage, 400, 600) }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        )
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
                <Text
                  style={[
                    styles.statusButtonText,
                    editedComic.status === "read" &&
                      styles.statusButtonTextActive,
                  ]}
                >
                  Read
                </Text>
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
                <Text
                  style={[
                    styles.statusButtonText,
                    editedComic.status === "to-read" &&
                      styles.statusButtonTextActive,
                  ]}
                >
                  To Read
                </Text>
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
                  coverImage: comic.coverImage,
                });
                setNewImage(null);
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
    fontSize: 14,
  },
  statusButtonTextActive: {
    color: "white",
  },
  imageButton: {
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
});
