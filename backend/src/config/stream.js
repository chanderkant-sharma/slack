import { StreamChat } from "stream-chat";
import { ENV } from "../config/env.js";

const streamClient = StreamChat.getInstance(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET);

export const upsertStreamUser = async (userData) => {
  await streamClient.upsertUser(userData);
  console.log("Stream user upserted successfully:", userData.name);
  return userData;
};

export const deleteStreamUser = async (userId) => {
  try {
    await streamClient.deleteUser(userId);
    console.log("Stream user deleted successfully:", userId);
  } catch (error) {
    console.error("Error deleting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  const userIdString = userId.toString();
  return streamClient.createToken(userIdString);
};

export const addUserToPublicChannels = async (newUserId) => {
  const publicChannels = await streamClient.queryChannels({ discoverable: true });

  for (const channel of publicChannels) {
    try {
      await channel.addMembers([newUserId]);
    } catch (error) {
      console.log(`Could not add user to channel ${channel.id}:`, error.message);
    }
  }
};
