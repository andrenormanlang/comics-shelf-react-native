import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  createComic,
  fetchGeneratedComicDescription,
} from "../../utils/appwrite";
import { uploadToCloudinary } from "../../utils/cloudinary";

const AddComicScreen = () => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("to-read");
  const [rating, setRating] = useState("0");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [generatingDesc, setGeneratingDesc] = useState(false);

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
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a comic title");
      return;
    }

    const ratingNum = parseInt(rating);
    if (
      status === "read" &&
      (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5)
    ) {
      Alert.alert("Error", "Please enter a valid rating between 1 and 5");
      return;
    }

    try {
      setLoading(true);
      setGeneratingDesc(true);

      // Upload image if one was selected
      let coverImage = null;
      if (image) {
        coverImage = await uploadToCloudinary(image);
      }

      console.log("Generating description for:", {
        title: title.trim(),
        status,
        rating: status === "read" ? ratingNum : 0,
      });

      // Generate description before creating the comic
      const description = await fetchGeneratedComicDescription(
        title.trim(),
        status,
        status === "read" ? ratingNum : 0
      );

      if (!description) {
        throw new Error("Failed to generate description");
      }

      // Create comic with the generated description
      await createComic({
        title: title.trim(),
        status,
        rating: status === "read" ? ratingNum : 0,
        coverImage,
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      router.back();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to add comic. Please try again."
      );
    } finally {
      setGeneratingDesc(false);
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) {
      return generatingDesc ? "Generating Desc..." : "Adding Comic...";
    }
    return "Add Comic";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Comic Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter comic title"
          editable={!loading}
        />

        <Text style={styles.label}>Cover Image</Text>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={pickImage}
          disabled={loading}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <Text style={styles.imageButtonText}>Select Cover Image</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              status === "read" && styles.statusButtonActive,
            ]}
            onPress={() => setStatus("read")}
            disabled={loading}
          >
            <Text
              style={[
                styles.statusButtonText,
                status === "read" && styles.statusButtonTextActive,
              ]}
            >
              Read
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              status === "to-read" && styles.statusButtonActive,
            ]}
            onPress={() => setStatus("to-read")}
            disabled={loading}
          >
            <Text
              style={[
                styles.statusButtonText,
                status === "to-read" && styles.statusButtonTextActive,
              ]}
            >
              To Read
            </Text>
          </TouchableOpacity>
        </View>

        {status === "read" && (
          <>
            <Text style={styles.label}>Rating (1-5)</Text>
            <TextInput
              style={styles.input}
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
              placeholder="Enter rating (1-5)"
              editable={!loading}
            />
          </>
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>{getButtonText()}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
    color: "#fff",
  },
  input: {
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    color: "#fff",
  },
  imageButton: {
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  imageButtonText: {
    color: "#BB86FC",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
  },
  statusButtonActive: {
    backgroundColor: "#BB86FC",
    borderColor: "#BB86FC",
  },
  statusButtonText: {
    color: "#888",
  },
  statusButtonTextActive: {
    color: "#000",
  },
  submitButton: {
    backgroundColor: "#BB86FC",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#333",
  },
  submitButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddComicScreen;
