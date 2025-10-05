import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Chat({}) {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<any[]>([]);

    const { userId: userIdStr = "", receiverId: receiverIdStr = "" } = useParams<{ userId: string; receiverId: string }>();

    const userId = userIdStr ? Number(userIdStr) : null;
    const receiverId = receiverIdStr ? Number(receiverIdStr) : null;

    useEffect(() => {
        socket.emit("register", userId);

        socket.on("private_message", (msg) => {
            setChat((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("private_message");
        };
    }, [userId]);

    const sendMessage = () => {
        if (!message.trim()) return;
        const msg = { senderId: userId, receiverId, content: message };
        socket.emit("private_message", msg);
        setChat((prev) => [...prev, msg]);
        setMessage("");
    };

    return (
        <div style={{ padding: 20 }}>
            <h3>
                Chat between {userId} and {receiverId}
            </h3>
            <div style={{ border: "1px solid #ccc", padding: 10, height: 200, overflowY: "auto" }}>
                {chat.map((m, i) => (
                    <div key={i} style={{ textAlign: m.senderId === userId ? "right" : "left" }}>
                        <b>{m.senderId === userId ? "You" : m.senderId}:</b> {m.content}
                    </div>
                ))}
            </div>

            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
