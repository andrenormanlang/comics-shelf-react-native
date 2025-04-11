import { CLOUDINARY_URL } from "@env";

export const uploadToCloudinary = async (imageUri) => {
  try {
    // Get the file extension from the URI
    const fileType = imageUri.substring(imageUri.lastIndexOf(".") + 1);
    const mimeType = `image/${fileType}` || "image/jpeg";

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: mimeType,
      name: `upload.${fileType}`,
    });
    formData.append("upload_preset", "comics_shelf");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dytiufsuu/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to upload image");
    }

    const data = await response.json();
    if (!data.secure_url) {
      throw new Error("No URL received from Cloudinary");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

export const getOptimizedImageUrl = (url, width = 300, height = 400) => {
  if (!url) return null;
  // Using c_scale instead of c_fill to preserve aspect ratio
  return url.replace("/upload/", `/upload/w_${width},h_${height},c_scale/`);
};

export default {
  uploadToCloudinary,
  getOptimizedImageUrl,
};
