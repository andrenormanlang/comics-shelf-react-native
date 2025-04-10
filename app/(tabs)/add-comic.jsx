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
import { createComic, fetchGeneratedComicDescription } from "../../utils/appwrite";
import { uploadToCloudinary } from "../../utils/cloudinary";
// Import the description generator


const AddComicScreen = () => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("to-read");
  const [rating, setRating] = useState("0");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  // Add state to show description generation status (optional but good UX)
  const [generatingDesc, setGeneratingDesc] = useState(false);

  const pickImage = async () => {
    // ... (keep existing pickImage function)
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
        mediaTypes: ImagePicker.MediaType, // Use MediaTypeOptions.Images
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

    setLoading(true); // Start loading indicator

    let generatedDescription = null;
    let coverImage = null;

    try {
      // ---- Step 1: Generate Description via Appwrite Function ----
      console.log("Attempting to generate description via backend...");
      const finalRating = status === "read" ? ratingNum : 0;
      // CALL THE NEW FUNCTION
      generatedDescription = await fetchGeneratedComicDescription(
        title,
        status,
        finalRating
      );

      if (generatedDescription === null) {
        // Function call failed or returned an error, inform user but proceed
         Alert.alert(
          "Info",
          "Could not generate description automatically. You can add one later."
        );
        // Keep generatedDescription as null
      } else {
        console.log("Description generated successfully.");
      }

      // ---- Step 2: Upload image if one was selected ----
      if (image) {
         console.log("Attempting to upload cover image...");
         try {
             coverImage = await uploadToCloudinary(image);
             console.log("Cover image uploaded:", coverImage);
         } catch(uploadError) {
            console.error("Failed to upload cover image:", uploadError);
            // Alert user and stop the process if image upload fails
            Alert.alert("Upload Error", "Failed to upload cover image. Please try again.");
            setLoading(false); // Stop loading
            return; // Exit handleSubmit
         }
      } else {
          console.log("No cover image selected for upload.");
      }

      // ---- Step 3: Create comic in database ----
      console.log("Attempting to create comic document...");
      await createComic({
        title,
        status,
        rating: status === "read" ? ratingNum : 0,
        coverImage, // Will be null if no image was uploaded
        description: generatedDescription || "", // Use generated or empty string
        // Let Appwrite handle createdAt/updatedAt if possible, otherwise:
        // createdAt: new Date().toISOString(),
        // updatedAt: new Date().toISOString(),
      });
      console.log("Comic created successfully in database.");

      router.back(); // Navigate back only on full success

    } catch (error) {
      // Catch errors from createComic or potentially unhandled errors from upstream
      Alert.alert("Error", "Failed to add comic. Please check logs and try again.");
      console.error("Error during handleSubmit:", error);
    } finally {
      setLoading(false); // Stop loading indicator regardless of outcome
    }
  };
 

  // Determine button text based on loading states
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
          {/* ... (keep existing status buttons) ... */}
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
          {/* Use the dynamic button text */}
          <Text style={styles.submitButtonText}>{getButtonText()}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// --- Keep existing styles ---
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