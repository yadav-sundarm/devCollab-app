import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGithubData } from '../services/github.services.js';
import { fetchUserById } from '../services/user.services.js';
import { Star } from 'lucide-react'
const UserProfile = () => {
    const { userId } = useParams()
    const loggedInUser = JSON.parse(localStorage.getItem('user'))
    const isOwnProfile = loggedInUser?._id === userId
    const [userData, setUserData] = useState(null)
    const [githubData, setGithubData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [user, github] = await Promise.all([fetchUserById(userId), fetchGithubData(userId)])
                setUserData(user)
                setGithubData(github)
            } catch (error) {
                console.error('Error loading profile:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [userId])

    if (loading) return (
        <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-24 bg-gray-200" />
                <div className="p-5 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
            </div>
        </div>
    )

    if (!userData) return (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">User not found.</p>
        </div>
    )

    return (
        <div className="space-y-3">
            {/* Profile header */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="h-24 bg-violet-600" />
                <div className="px-5 pb-5">
                    <div className="flex items-end justify-between -mt-10 mb-3">
                        <img
                            src={githubData?.profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.userName}`}
                            alt="avatar"
                            className="w-20 h-20 rounded-full border-4 border-white object-cover"
                        />
                        <div className="flex items-center gap-2 mb-1 flex-wrap justify-end">
                            {userData.githubLink && (
                                <a href={userData.githubLink} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-gray-700 border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg transition">
                                    GitHub
                                </a>
                            )}
                            {userData.linkedinLink && (
                                <a href={userData.linkedinLink} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition">
                                    LinkedIn
                                </a>
                            )}
                            {userData.portFolioLink && (
                                <a href={userData.portFolioLink} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-gray-700 border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg transition">
                                    Portfolio
                                </a>
                            )}
                            {isOwnProfile && (
                                <button className="text-xs text-violet-600 border border-violet-300 hover:border-violet-500 px-3 py-1.5 rounded-lg transition">
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900">{userData.userName}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{userData.email}</p>
                    {githubData?.profile?.bio && (
                        <p className="text-sm text-gray-600 mt-2">{githubData.profile.bio}</p>
                    )}
                </div>
            </div>

            {/* GitHub stats */}
            {githubData && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Repos', value: githubData.profile?.publicRepos },
                        { label: 'Followers', value: githubData.profile?.followers },
                        { label: 'Following', value: githubData.profile?.following },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                            <p className="text-2xl font-semibold text-gray-900">{stat.value ?? '—'}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 text-sm mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {userData.skills?.map(skill => (
                        <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 text-xs rounded-full border border-violet-100">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Top Languages */}
            {githubData?.topLanguages && Object.keys(githubData.topLanguages).length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="font-semibold text-gray-900 text-sm mb-3">Top Languages</h2>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(githubData.topLanguages).map(([lang, count]) => (
                            <span key={lang} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {lang}
                                <span className="text-gray-400">({count})</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Repos */}
            {githubData?.repos?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-5 py-3 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900 text-sm">Repositories</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {githubData.repos.slice(0, 6).map(repo => (
                            <div key={repo.name} className="px-5 py-3 hover:bg-gray-50 transition">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-violet-600">{repo.name}</span>
                                    <div className="flex items-center gap-3">
                                        {repo.language && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{repo.language}</span>
                                        )}
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Star className="w-3 h-3" />{repo.stars}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Updated {new Date(repo.updatedAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserProfile;