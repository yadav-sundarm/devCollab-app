import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { io } from "socket.io-client"
import { getMessagesByProject } from "../services/message.services.js"

const socket = io("http://localhost:5000")

const Chat = () => {
    const { projectId } = useParams()
    const user = JSON.parse(localStorage.getItem("user"))
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const messagesEndRef = useRef(null)

    useEffect(() => {
        // Join the room
        socket.emit("joinRoom", projectId)

        // Load previous messages
        const loadMessages = async () => {
            try {
                const data = await getMessagesByProject(projectId)
                setMessages(data)
            } catch (error) {
                console.error("Error loading messages:", error)
            }
        }
        loadMessages()

        // Listen for new messages
        socket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message])
        })

        return () => {
            socket.off("receiveMessage")
        }
    }, [projectId])

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendMessage = () => {
        if (!input.trim()) return
        socket.emit("sendMessage", {
            projectId,
            senderId: user._id,
            receiverId: "", // will handle later
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