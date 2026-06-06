import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getMessagesByUser } from "../services/message.services.js"

const MyChats = () => {
    const [chats, setChats] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const loadChats = async () => {
            try {
                const data = await getMessagesByUser()
                // Group messages by projectId to show unique conversations
                const uniqueChats = data.reduce((acc, msg) => {
                    if (!acc[msg.projectId]) {
                        acc[msg.projectId] = msg
                    }
                    return acc
                }, {})
                setChats(Object.values(uniqueChats))
            } catch (error) {
                console.error("Error loading chats:", error)
            }
        }
        loadChats()
    }, [])

    return (
        <div>
            <h2>My Chats</h2>
            {chats.length === 0 ? (
                <p>No conversations yet</p>
            ) : (
                chats.map((chat) => (
                    <div key={chat.projectId} onClick={() => navigate(`/chat/${chat.projectId}`)}>
                        <p>Project: {chat.projectId}</p>
                        <p>Last message: {chat.content}</p>
                    </div>
                ))
            )}
        </div>
    )
}

export default MyChats