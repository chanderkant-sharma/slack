import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";
import { addUserToPublicChannels, upsertStreamUser } from "../config/stream.js";

const toPublicUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  image: user.image,
});

const syncStreamUser = async (user) => {
  const userId = user._id.toString();
  await upsertStreamUser({
    id: userId,
    name: user.name,
    image: user.image || undefined,
  });
  return userId;
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email?.trim() || !password || !name?.trim()) {
      return res.status(400).json({ message: "Email, password, and name are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
    });

    const userId = await syncStreamUser(user);

    try {
      await addUserToPublicChannels(userId);
    } catch (channelError) {
      console.log("Warning: could not add user to public channels:", channelError.message);
    }

    const token = signToken(userId);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.log("Error registering user:", error);
    res.status(500).json({ message: "Failed to register" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !user.password) {
      return res.status(401).json({
        message: "Invalid email or password. Old accounts must register again.",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    await syncStreamUser(user);

    const token = signToken(user._id.toString());
    res.status(200).json({ token, user: toPublicUser(user) });
  } catch (error) {
    console.log("Error logging in:", error);
    res.status(500).json({ message: "Failed to log in" });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({ user: toPublicUser(req.user) });
};
