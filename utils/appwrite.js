import { Client, Databases, ID, Functions } from "react-native-appwrite"; // Import Functions
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID, // Make sure this is in @env and correct
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
  APPWRITE_PLATFORM,      // Add this to @env (e.g., com.comicsshelf.app)
  APPWRITE_FUNCTION_ID_GENERATE_DESC // <-- ADD THIS to .env (value: comics_description_ai)
} from "@env";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject("67f6973b002c893af4b4")
  .setPlatform("com.comicsshelf.app");

const databases = new Databases(client);
const functions = new Functions(client);

const DATABASE_ID = APPWRITE_DATABASE_ID;
const COLLECTION_ID = APPWRITE_COLLECTION_ID;
const FUNCTION_ID_GENERATE_DESC = APPWRITE_FUNCTION_ID_GENERATE_DESC;

export const getComics = async () => {
  try {
    console.log("Fetching comics with:", { DATABASE_ID, COLLECTION_ID });
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    console.log("Raw Appwrite response:", response);
    return response.documents;
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


// --- New function to call the backend function ---
export const fetchGeneratedComicDescription = async (title, status, rating) => {
  // Ensure the Function ID is defined
  if (!FUNCTION_ID_GENERATE_DESC) {
      console.error("Appwrite Function ID for description generation is not defined in .env");
      return null;
  }
  console.log(`Calling Appwrite function '${FUNCTION_ID_GENERATE_DESC}' for title: ${title}`);
  try {
    const execution = await functions.createExecution(
      FUNCTION_ID_GENERATE_DESC,
      JSON.stringify({ title, status, rating }), // Pass data as JSON string payload
      false // Synchronous execution (waits for result)
    );

    console.log("Function execution result status:", execution.status);

    if (execution.status === 'completed') {
      console.log("Raw function response body:", execution.responseBody);
      try {
         // Parse the response body, which is a string containing JSON
         const response = JSON.parse(execution.responseBody);
         if (response.success) {
            console.log("Appwrite function returned description successfully.");
            return response.description; // Return the description string
         } else {
            // The function executed but reported failure internally
            console.error("Appwrite function execution reported an error:", response.error);
            return null; // Indicate failure to generate
         }
      } catch (parseError) {
         // The function might have failed and returned non-JSON output
         console.error("Failed to parse function response body:", parseError);
         console.error("Function stderr (if any):", execution.stderr); // Log standard error
         return null;
      }

    } else {
      // The function execution itself failed (e.g., timeout, runtime error)
      console.error("Appwrite function execution failed:", execution.stderr || `Status: ${execution.status}`);
      return null; // Indicate failure
    }
  } catch (error) {
    // Error occurred in the client trying to *call* the function
    console.error('Client-side error executing Appwrite function:', error);
    if (error.response) {
        console.error('Appwrite error response details:', error.response);
    }
    return null; // Indicate failure
  }
};

export default {
  getComics,
  createComic,
  updateComic,
  deleteComic,
  fetchGeneratedComicDescription,
};
