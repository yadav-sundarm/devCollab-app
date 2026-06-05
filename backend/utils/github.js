import axios from "axios";
const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_API}`,
  },
});
// 1. Get user profile stats
export const getUserProfile = async (githubUrl) => {
  try {
    const username = githubUrl.split("/")[3];
    const response = await githubApi.get(`/users/${username}`);
    return {
      avatar: response.data.avatar_url,
      bio: response.data.bio,
      followers: response.data.followers,
      following: response.data.following,
      publicRepos: response.data.public_repos,
      createdAt: response.data.created_at,
    };
  } catch (error) {
    console.log("Error fetvhing user profile : ", error);
    throw error;
  }
};

// 2. Get repositories
export const getRepos = async (username) => {
  try {
    const response = await githubApi.get(
      `/users/${username}/repos?per_page=50`,
    );
    return response.data.map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      language: repo.language,
      updatedAt: repo.updated_at,
    }));
  } catch (error) {
    console.log("Error fetching repos : ", error);
    throw error;
  }
};

// 3. Get top languages
export const getTopLanguages = async (username) => {
  try {
    const repos = await getRepos(username);
    const languages = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });
    return languages;
  } catch (error) {
    console.log("Error fetching languages : ", error);
    throw error;
  }
};
