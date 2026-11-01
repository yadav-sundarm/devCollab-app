import { getUserProfile, getRepos, getTopLanguages } from "../utils/github.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const fetchGithubData = async (req, res) => {
  try {
    if (!mongoose.isObjectIdOrHexString(req.params.userId)) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const username = user.githubLink.replace(/\/$/, "").split("/").pop();
    const [profile, repos] = await Promise.all([
      getUserProfile(user.githubLink),
      getRepos(username),
    ]);
    const topLanguages = getTopLanguages(repos);

    res.status(200).json({ profile, repos, topLanguages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
