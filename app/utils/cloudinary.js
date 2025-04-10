import { CLOUDINARY_URL } from "@env";

export const uploadToCloudinary = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
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

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

export const getOptimizedImageUrl = (url, width = 300, height = 400) => {
  if (!url) return null;
  return url.replace("/upload/", `/upload/w_${width},h_${height},c_fill/`);
};

export default {
  uploadToCloudinary,
  getOptimizedImageUrl,
};
