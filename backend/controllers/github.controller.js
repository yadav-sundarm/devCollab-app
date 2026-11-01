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
    if (!user.githubLink) {
      return res.status(422).json({
        message: "This account does not have a linked GitHub profile.",
      });
    }

    const username = user.githubLink.replace(/\/$/, "").split("/").pop();
    let profile;
    try {
      profile = await getUserProfile(user.githubLink);
    } catch (error) {
      const githubStatus = error.response?.status;
      console.error("GitHub profile request failed:", githubStatus, error.message);

      if (githubStatus === 404) {
        return res.status(404).json({
          message: "The linked GitHub account could not be found.",
        });
      }
      if (githubStatus === 401 || githubStatus === 403) {
        return res.status(502).json({
          message: "GitHub rejected the API request. Check the backend GITHUB_API token and GitHub rate limit.",
        });
      }
      return res.status(502).json({
        message: "GitHub is temporarily unavailable. Please try again later.",
      });
    }

    let repos = [];
    let repositoriesWarning = null;
    try {
      repos = await getRepos(username);
    } catch (error) {
      console.error("GitHub repositories request failed:", error.response?.status, error.message);
      repositoriesWarning = "GitHub profile loaded, but repository data is temporarily unavailable.";
    }

    const topLanguages = getTopLanguages(repos);

    res.status(200).json({
      profile,
      repos,
      topLanguages,
      warning: repositoriesWarning,
    });
  } catch (error) {
    console.error("Unexpected GitHub profile error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
