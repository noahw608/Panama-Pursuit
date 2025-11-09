import { useState, useRef, useEffect } from "react";

interface ChatPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: number;
    text: string;
    sender: "user" | "ai";
}

export default function ChatPopup({ isOpen, onClose }: ChatPopupProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [visible, setVisible] = useState(false); // for fade-in
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setVisible(false);
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = { id: messages.length, text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        setTimeout(() => {
            const aiMessage: Message = {
                id: messages.length + 1,
                text: "This is a placeholder AI response.",
                sender: "ai",
            };
            setMessages((prev) => [...prev, aiMessage]);
        }, 500);
    };

    return (
        <div
            className={`fixed top-1/10 right-2 h-2/3 w-96 bg-white rounded-xl shadow-xl flex flex-col z-50
        transition-opacity duration-500 ease-in-out
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-teal text-white rounded-xl">
                <h2 className="text-lg font-semibold">Chat</h2>
                <button
                    onClick={onClose}
                    className="text-white bg-teal-800 hover:bg-teal-900 w-7 h-7 flex items-center justify-center rounded-full font-bold"
                >
                    ×
                </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`p-2 rounded-lg max-w-xs break-words ${
                            msg.sender === "user"
                                ? "bg-blue-400 self-end ml-auto"
                                : "bg-gray-500 self-start ml-4"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-yellow-500 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-400 rounded-lg outline-none bg-gray-100 text-gray-900"
                />

                <button
                    onClick={handleSend}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
