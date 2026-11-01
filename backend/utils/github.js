import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
});

githubApi.interceptors.request.use((config) => {
  if (process.env.GITHUB_API) {
    config.headers.Authorization = `Bearer ${process.env.GITHUB_API}`;
  } else {
    delete config.headers.Authorization;
  }
  config.headers.Accept = "application/vnd.github+json";
  config.headers["X-GitHub-Api-Version"] = "2022-11-28";
  return config;
});

export const getUserProfile = async (githubUrl) => {
  try {
    const username = githubUrl.replace(/\/$/, "").split("/").pop();
    const response = await githubApi.get(`/users/${username}`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_API}` },
    });
    return {
      avatar: response.data.avatar_url,
      bio: response.data.bio,
      followers: response.data.followers,
      following: response.data.following,
      publicRepos: response.data.public_repos,
      createdAt: response.data.created_at,
    };
  } catch (error) {
    console.error("Error fetching GitHub user profile:", error.response?.status, error.message);
    throw error;
  }
};

export const getRepos = async (username) => {
  try {
    const response = await githubApi.get(
      `/users/${username}/repos?per_page=50`,
      {
        headers: { Authorization: `Bearer ${process.env.GITHUB_API}` },
      },
    );
    return response.data.map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      language: repo.language,
      updatedAt: repo.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error.response?.status, error.message);
    throw error;
  }
};

export const getTopLanguages = (repos) => {
  const languages = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });
  return languages;
};
