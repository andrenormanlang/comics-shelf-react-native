import { Client, Databases, ID, Functions } from "react-native-appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
} from "@env";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform("com.comicsshelf.app"); // Add platform information

const databases = new Databases(client);
const functions = new Functions(client);

const DATABASE_ID = APPWRITE_DATABASE_ID;
const COLLECTION_ID = APPWRITE_COLLECTION_ID;
const FUNCTION_ID = "comics_description_ai"; // Updated to the correct function ID

export const getComics = async () => {
  try {
    console.log("Starting getComics function with:", {
      endpoint: APPWRITE_ENDPOINT,
      projectId: APPWRITE_PROJECT_ID,
      databaseId: DATABASE_ID,
      collectionId: COLLECTION_ID,
    });

    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    console.log("Appwrite listDocuments response:", response);

    if (!response || !response.documents) {
      console.warn("No documents found in response");
      return [];
    }

    console.log(`Found ${response.documents.length} comics`);
    return response.documents;
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

// --- New function to call the backend function ---
export const fetchGeneratedComicDescription = async (
  title,
  status,
  rating = 0
) => {
  try {
    if (!title || !status) {
      throw new Error("Title and status are required fields");
    }

    const data = JSON.stringify({
      title: title.trim(),
      status: status.trim(),
      rating: parseInt(rating) || 0,
    });

    console.log("Calling AI function with data:", data);

    const execution = await functions.createExecution(FUNCTION_ID, data);

    console.log("Function execution response:", execution);

    if (!execution) {
      throw new Error("No execution response received");
    }

    // Parse the response - try both response and responseBody properties
    let responseData;
    if (execution.response) {
      try {
        responseData = typeof execution.response === 'string' 
          ? JSON.parse(execution.response)
          : execution.response;
        console.log("Parsed response:", responseData);
      } catch (parseError) {
        console.error("Failed to parse response:", execution.response);
        throw new Error("Invalid response format from AI function");
      }
    } else if (execution.responseBody) {
      try {
        responseData = typeof execution.responseBody === 'string'
          ? JSON.parse(execution.responseBody)
          : execution.responseBody;
        console.log("Parsed response from responseBody:", responseData);
      } catch (parseError) {
        console.error("Failed to parse responseBody:", execution.responseBody);
        throw new Error("Invalid response format from AI function");
      }
    }

    // Check if we got any response data
    if (!responseData) {
      console.error("No response data received from function");
      throw new Error("No response received from AI function");
    }

    // Check for errors in the response
    if (responseData.error) {
      throw new Error(responseData.error);
    }

    // Validate response data
    if (!responseData.success || !responseData.description) {
      console.error("Invalid response format:", responseData);
      throw new Error("Invalid response from AI function");
    }

    return responseData.description;
  } catch (error) {
    console.error("Error executing AI function:", error);
    throw error;
  }
};

export default {
  getComics,
  createComic,
  updateComic,
  deleteComic,
  fetchGeneratedComicDescription,
};
