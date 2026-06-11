import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    avatar: {
      type: String,
    },
    githubLink: {
      type: String,
    },
    linkedinLink: {
      type: String,
    },
    portFolioLink: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userModel);

export default User;
