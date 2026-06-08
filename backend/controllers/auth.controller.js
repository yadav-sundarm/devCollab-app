import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupController = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      githubLink,
      linkedinLink,
      portFolioLink,
      skills,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      githubLink,
      linkedinLink,
      portFolioLink,
      skills,
    });
    const dataToSend = await User.findById(user._id).select("-password");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({ user: dataToSend, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const dataToSend = await User.findById(user._id).select("-password");
    res.status(200).json({ user: dataToSend, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
