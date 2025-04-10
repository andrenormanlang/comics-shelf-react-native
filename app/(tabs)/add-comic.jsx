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

const AddComicScreen = () => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("to-read");
  const [rating, setRating] = useState("0");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
      // Here you would implement your own storage logic
      // For now, we'll just simulate success
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to add comic. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.submitButtonText}>
            {loading ? "Adding..." : "Add Comic"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imageButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  imageButtonText: {
    color: "#666",
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
  statusButtonTextActive: {
    color: "white",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddComicScreen;
