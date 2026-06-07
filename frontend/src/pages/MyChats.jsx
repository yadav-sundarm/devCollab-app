import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessagesByUser } from '../services/message.services.js';
import { MessageSquare, ChevronRight } from 'lucide-react';

const MyChats = () => {
    const [chats, setChats] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const loadChats = async () => {
            try {
                const data = await getMessagesByUser()
                const uniqueChats = data.reduce((acc, msg) => {
                    if (!acc[msg.projectId]) acc[msg.projectId] = msg
                    return acc
                }, {})
                setChats(Object.values(uniqueChats))
            } catch (error) {
                console.error('Error loading chats:', error)
            }
        }
        loadChats()
    }, [])

    return (
        <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
                <h1 className="font-semibold text-gray-900">Messages</h1>
                <p className="text-xs text-gray-500 mt-0.5">{chats.length} conversation{chats.length !== 1 ? 's' : ''}</p>
            </div>

            {chats.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                    <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No conversations yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                    {chats.map(chat => (
                        <div key={chat.projectId} onClick={() => navigate(`/chat/${chat.projectId}`)}
                            className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 cursor-pointer transition">
                            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                                <MessageSquare className="w-5 h-5 text-violet-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {chat.projectId?.title || 'Project Chat'}
                                </p>
                                <p className="text-xs text-gray-500 truncate mt-0.5">{chat.content}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyChats;