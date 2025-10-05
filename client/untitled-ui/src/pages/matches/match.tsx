import React from "react";
import { useNavigate } from "react-router";

type MatchParams = {
    name: string;
    role: string;
    description?: string;
    currentUserId: number;
    userId: number;
    // Optional UI extras for the card
    avatarUrl?: string;
    cityTag?: string; // e.g. "Rijeka"
    date?: string; // e.g. "18.09"
    online?: boolean;
};

export function Match({ name, role, description, currentUserId, userId, avatarUrl, cityTag, date, online = true }: MatchParams) {
    const navigate = useNavigate();

    const openChat = () => navigate(`/chat/${currentUserId}/${userId}`);
    console.log(date);
    return (
        <div
            onClick={openChat}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:bg-gray-50 hover:shadow-md"
        >
            {/* Avatar */}
            <div className="relative">
                {avatarUrl ? (
                    <img src={avatarUrl} alt={`${name} avatar`} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                        {name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                )}
                <span className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full ring-2 ring-white ${online ? "bg-emerald-500" : "bg-gray-300"}`} />
            </div>

            {/* Main content */}
            <div className="flex min-w-0 flex-1 items-start gap-2">
                <div className="min-w-0 flex-1">
                    {/* Name */}
                    <p className="truncate text-base font-semibold text-gray-900">{name}</p>

                    {/* Country and Date under name */}
                    {(cityTag || date) && (
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            {cityTag && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                                    {cityTag}
                                </span>
                            )}
                            {date && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
                                    {date}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
