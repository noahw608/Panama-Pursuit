import type { JSX } from "react";
import { useState } from "react";
import { Banana } from "lucide-react";
import ChatPopup from "./ChatPopup"; // Make sure this path is correct

export default function Header(): JSX.Element {
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <header className="border-b-2 border-yellow-500">
            <div className="navbar bg-teal shadow-sm">
                <div className="flex-1">
                    <a className="btn btn-ghost text-3xl text-yellow-500">Panama Pursuit</a>
                </div>
                <div className="flex-none mr-2">
                    <button
                        className="btn !bg-yellow-500"
                        onClick={() => setChatOpen(true)}
                    >
                        <Banana className="h-6 w-6 text-teal" />
                    </button>
                </div>
            </div>

            {/* Chat popup */}
            <ChatPopup isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </header>
    );
}
