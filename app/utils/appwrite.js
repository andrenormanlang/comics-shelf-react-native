import { Client, Databases, ID } from "react-native-appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
  APPWRITE_PLATFORM_NAME,
} from "@env";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform(APPWRITE_PLATFORM_NAME);

const databases = new Databases(client);

const DATABASE_ID = APPWRITE_DATABASE_ID;
const COLLECTION_ID = APPWRITE_COLLECTION_ID;

export const getComics = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return response;
  } catch (error) {
    console.error("Error fetching comics:", error);
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
