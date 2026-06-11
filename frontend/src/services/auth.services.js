export const initiateGithubLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/github`;
};
