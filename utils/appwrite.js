import { Client, Databases, ID } from "react-native-appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
} from "@env";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject("67f6973b002c893af4b4")
  .setPlatform("com.comicsshelf.app");

const databases = new Databases(client);

const DATABASE_ID = APPWRITE_DATABASE_ID;
const COLLECTION_ID = APPWRITE_COLLECTION_ID;

export const getComics = async () => {
  try {
    console.log("Fetching comics with:", { DATABASE_ID, COLLECTION_ID });
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    console.log("Raw Appwrite response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching comics:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      type: error.type,
    });
    throw error;
  }
};

export const createComic = async (data) => {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      data
    );
  } catch (error) {
    console.error("Error creating comic:", error);
    throw error;
  }
};

export const updateComic = async (documentId, data) => {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId,
      data
    );
  } catch (error) {
    console.error("Error updating comic:", error);
    throw error;
  }
};

export const deleteComic = async (documentId) => {
  try {
    return await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId
    );
  } catch (error) {
    console.error("Error deleting comic:", error);
    throw error;
  }
};

export default {
  getComics,
  createComic,
  updateComic,
  deleteComic,
};
