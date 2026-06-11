import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getMessagesByProject } from '../services/message.services.js';
import { getProjectById } from '../services/project.services.js';
import { Send } from 'lucide-react';

const Chat = () => {
    const { projectId } = useParams()
    const user = JSON.parse(localStorage.getItem('user'))
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [projectTitle, setProjectTitle] = useState('Project Chat')
    const messagesEndRef = useRef(null)
    const socketRef = useRef(null)

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_API_URL, {
            auth: {
                token: localStorage.getItem("token")
            }
        });
        socketRef.current.emit('joinRoom', projectId)

        const loadData = async () => {
            try {
                const [messages, project] = await Promise.all([
                    getMessagesByProject(projectId),
                    getProjectById(projectId)
                ])
                setMessages(messages)
                setProjectTitle(project.title || 'Project Chat')
            } catch (error) {
                console.error('Error loading chat:', error)
            }
        }
        loadData()

        socketRef.current.on('receiveMessage', (message) => {
            setMessages(prev => [...prev, message])
        })

        return () => {
            socketRef.current.off('receiveMessage')
            socketRef.current.disconnect()
        }
    }, [projectId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        if (!input.trim()) return
        socketRef.current.emit('sendMessage', { projectId, senderId: user._id, content: input })
        setInput('')
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 90px)' }}>
            <div className="px-5 py-3 border-b border-gray-200 shrink-0">
                <h2 className="font-semibold text-gray-900">{projectTitle}</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.map((msg, index) => {
                    const isOwn = msg.senderId?._id === user._id || msg.senderId === user._id
                    return (
                        <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col gap-1 max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
                                {!isOwn && (
                                    <span className="text-xs text-gray-500 px-1">{msg.senderId?.userName || 'User'}</span>
                                )}
                                <div className={`px-4 py-2 rounded-2xl text-sm ${isOwn ? 'bg-violet-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-gray-200 shrink-0">
                <div className="flex items-center gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
                    />
                    <button onClick={sendMessage}
                        className="w-9 h-9 bg-violet-600 hover:bg-violet-700 text-white rounded-full flex items-center justify-center shrink-0 transition">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat;