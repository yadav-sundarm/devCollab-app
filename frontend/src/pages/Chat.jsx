import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { io } from "socket.io-client"
import { getMessagesByProject } from "../services/message.services.js"

const Chat = () => {
    const { projectId } = useParams()
    const user = JSON.parse(localStorage.getItem("user"))
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const messagesEndRef = useRef(null)
    const socketRef = useRef(null)        // ← inside the component

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_API_URL)
        socketRef.current.emit("joinRoom", projectId)

        const loadMessages = async () => {
            try {
                const data = await getMessagesByProject(projectId)
                setMessages(data)
            } catch (error) {
                console.error("Error loading messages:", error)
            }
        }
        loadMessages()

        socketRef.current.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message])
        })

        return () => {
            socketRef.current.off("receiveMessage")
            socketRef.current.disconnect()  // ← also disconnect on cleanup
        }
    }, [projectId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendMessage = () => {
        if (!input.trim()) return
        socketRef.current.emit("sendMessage", {
            projectId,
            senderId: user._id,
            content: input
        })
        setInput("")
    }

    return (
        <div>
            <h2>Project Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.senderId?.userName || "User"}:</strong>
                        <span>{msg.content}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    )
}

export default Chat