import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    githubLink: {
      type: String,
      required: true,
    },
    linkedinLink: {
      type: String,
    },
    portFolioLink: {
      type: String,
    },
    skills: {
      type: [String],
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userModel);

export default User;
