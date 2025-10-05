import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "@untitledui/icons";
import { useLocation, useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

type ChatMsg = {
    senderId: number | null;
    receiverId: number | null;
    content: string;
    timestamp?: number;
};

export default function Chat() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<ChatMsg[]>([]);

    const { userId: userIdStr = "", receiverId: receiverIdStr = "" } = useParams<{ userId: string; receiverId: string }>();
    const userId = userIdStr ? Number(userIdStr) : null;
    const otherId = receiverIdStr ? Number(receiverIdStr) : null;

    const location = useLocation() as { state?: { receiverName?: string; receiverAvatar?: string } };

    const receiverName = location.state?.receiverName || (otherId ? `User ${otherId}` : "Chat");
    const receiverAvatar = location.state?.receiverAvatar;

    const navigate = useNavigate();
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!userId) return;
        socket.emit("register", userId);

        const onMessage = (msg: ChatMsg) => {
            const withTs = { ...msg, timestamp: msg.timestamp ?? Date.now() };
            setChat((prev) => [...prev, withTs]);
        };

        socket.on("private_message", onMessage);
        return () => {
            socket.off("private_message", onMessage);
        };
    }, [userId]);

    useEffect(() => {}, [otherId]);

    useEffect(() => {
        // auto scroll to bottom on new messages
        const el = listRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [chat.length]);

    const sendMessage = () => {
        if (!message.trim()) return;
        const msg: ChatMsg = { senderId: userId, receiverId: otherId, content: message, timestamp: Date.now() };
        socket.emit("private_message", msg);
        setChat((prev) => [...prev, msg]);
        setMessage("");
    };

    const groups = useMemo(() => {
        // group by day to render separators like "Today"
        const out: { label: string; items: ChatMsg[] }[] = [];
        const todayStr = new Date().toDateString();
        for (const m of chat) {
            const d = new Date(m.timestamp ?? Date.now());
            const dayKey = d.toDateString();
            const label = dayKey === todayStr ? "Today" : d.toLocaleDateString(undefined, { weekday: "long" });
            const last = out[out.length - 1];
            if (!last || last.label !== label) out.push({ label, items: [m] });
            else last.items.push(m);
        }
        return out;
    }, [chat]);

    const formatTime = (ts?: number) => new Date(ts ?? Date.now()).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });

    return (
        <div className="flex h-[100dvh] flex-col bg-white">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b bg-white/90 p-4 backdrop-blur">
                <div className="relative mx-auto flex max-w-[640px] items-center justify-center">
                    <button onClick={() => navigate(-1)} className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100">
                        <ArrowLeft />
                    </button>
                    <div className="text-base font-semibold text-gray-900">{receiverName}</div>
                </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-4 overflow-y-auto p-4">
                {groups.map((g, gi) => (
                    <div key={gi}>
                        {/* Day separator */}
                        <div className="my-2 flex items-center gap-3">
                            <div className="h-px flex-1 bg-gray-200" />
                            <div className="text-xs font-medium text-gray-400">{g.label}</div>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        {g.items.map((m, i) => {
                            const isMe = m.senderId === userId;
                            return (
                                <div key={i} className={isMe ? "flex w-full justify-end" : "flex w-full justify-start"}>
                                    {!isMe && (
                                        <div className="mt-6 mr-2 h-8 w-8 shrink-0">
                                            {receiverAvatar ? (
                                                <div className="relative">
                                                    <img src={receiverAvatar} alt={receiverName} className="h-8 w-8 rounded-full object-cover" />
                                                    <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                                </div>
                                            ) : (
                                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                                                    {receiverName.charAt(0)}
                                                    <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className={isMe ? "max-w-[75%] text-right" : "max-w-[75%]"}>
                                        <div className={isMe ? "mb-1 text-right text-[11px] text-gray-400" : "mb-1 text-left text-[11px] text-gray-500"}>
                                            {isMe ? "You" : receiverName} <span className="ml-1">{formatTime(m.timestamp)}</span>
                                        </div>
                                        <div
                                            className={
                                                isMe
                                                    ? "inline-block rounded-2xl bg-orange-500 px-3 py-2 text-sm text-white shadow"
                                                    : "inline-block rounded-2xl bg-gray-100 px-3 py-2 text-sm text-gray-900 shadow"
                                            }
                                        >
                                            {m.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Composer */}
            <div className="border-t bg-white p-3">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                    className="mx-auto flex w-full max-w-[640px] items-center gap-2"
                >
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Message"
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                        className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                        type="submit"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow hover:bg-orange-600"
                        aria-label="Send message"
                    >
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
}
