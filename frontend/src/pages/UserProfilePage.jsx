import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchGithubData } from "../services/github.services";

const UserProfile = () => {
    const { userId } = useParams();
    const userData = JSON.parse(localStorage.getItem("user"));
    const [githubData, setGithubData] = useState(null);

    useEffect(() => {
        const loadGithubData = async () => {
            try {
                const data = await fetchGithubData(userId);
                setGithubData(data);
            } catch (error) {
                console.error("Error fetching GitHub data:", error);
            }
        };
        loadGithubData();
    }, [userId]);

    return (
        <div>
            {/* User info from localStorage */}
            <h1>{userData?.userName}</h1>
            <p>{userData?.email}</p>

            {/* GitHub data - only show when loaded */}
            {githubData && (
                <div>
                    <img src={githubData.profile?.avatar} />
                    <p>{githubData.profile?.bio}</p>  {/* bio */}
                    <p>Followers: {githubData.profile?.followers}</p>
                    <p>Repos: {githubData.profile?.publicRepos}</p>

                    {/* Repos list */}
                    {githubData.repos?.map((repo) => (
                        <div key={repo.name}>
                            <p>{repo.name}</p>  {/* name */}
                            <p>⭐ {repo.stars}</p>  {/* stars */}
                            <p>{repo.language}</p>  {/* language */}
                        </div>
                    ))}

                    {/* Top languages */}
                    {Object.entries(githubData.topLanguages || {}).map(([lang, count]) => (
                        <p key={lang}>{lang}: {count} repos</p>
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserProfile;