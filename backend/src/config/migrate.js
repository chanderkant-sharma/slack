import { User } from "../models/user.model.js";

export const runMigrations = async () => {
  try {
    const indexes = await User.collection.indexes();
    const legacyClerkIndex = indexes.find((index) => index.key?.clerkId);

    if (legacyClerkIndex) {
      await User.collection.dropIndex(legacyClerkIndex.name);
      console.log("Dropped legacy clerkId index from users collection");
    }
  } catch (error) {
    if (error.codeName !== "IndexNotFound") {
      console.log("Migration warning:", error.message);
    }
  }
};
