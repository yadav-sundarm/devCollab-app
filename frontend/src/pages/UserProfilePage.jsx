import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchGithubData } from "../services/github.services.js";
import { fetchUserById } from "../services/user.services";

const UserProfile = () => {
    const { userId } = useParams();
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const isOwnProfile = loggedInUser?._id === userId;

    const [userData, setUserData] = useState(null);
    const [githubData, setGithubData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [user, github] = await Promise.all([
                    fetchUserById(userId),
                    fetchGithubData(userId)
                ])
                setUserData(user);
                setGithubData(github);
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [userId]);

    if (loading) return <p>Loading profile...</p>
    if (!userData) return <p>User not found!</p>

    return (
        <div>
            {/* User Info */}
            <div>
                <img src={githubData?.profile?.avatar || '/default-avatar.png'} alt="avatar" />
                <h1>{userData.userName}</h1>
                <p>{userData.email}</p>
                <p>{githubData?.profile?.bio}</p>
                <a href={userData.githubLink} target="_blank">GitHub</a>
                {userData.linkedinLink && (
                    <a href={userData.linkedinLink} target="_blank">LinkedIn</a>
                )}
                {userData.portFolioLink && (
                    <a href={userData.portFolioLink} target="_blank">Portfolio</a>
                )}
                {isOwnProfile && (
                    <button>Edit Profile</button>
                )}
            </div>

            {/* Skills */}
            <div>
                <h2>Skills</h2>
                {userData.skills?.map(skill => (
                    <span key={skill}>{skill}</span>
                ))}
            </div>

            {/* GitHub Stats */}
            {githubData && (
                <div>
                    <h2>GitHub Stats</h2>
                    <p>Public Repos: {githubData.profile?.publicRepos}</p>
                    <p>Followers: {githubData.profile?.followers}</p>
                    <p>Following: {githubData.profile?.following}</p>

                    {/* Top Languages */}
                    <h2>Top Languages</h2>
                    {Object.entries(githubData.topLanguages || {}).map(([lang, count]) => (
                        <p key={lang}>{lang}: {count} repos</p>
                    ))}

                    {/* Repos */}
                    <h2>Repositories</h2>
                    {githubData.repos?.map(repo => (
                        <div key={repo.name}>
                            <p>{repo.name}</p>
                            <p>⭐ {repo.stars}</p>
                            <p>{repo.language}</p>
                            <p>Updated: {new Date(repo.updatedAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserProfile;