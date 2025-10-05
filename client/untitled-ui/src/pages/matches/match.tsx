import React, { useEffect, useState } from "react"; // added useEffect/useState
import { useNavigate } from "react-router";
import { Avatar } from "@/components/base/avatar/avatar";

type MatchParams = {
    name: string;
    role: string;
    description?: string;
    currentUserId: number;
    userId: number;
    avatarUrl?: any; // was string; server may send array or id
    cityTag?: string;
    date?: string;
    online?: boolean;
};

export function Match({ name, role, description, currentUserId, userId, avatarUrl, cityTag, date, online = true }: MatchParams) {
    const navigate = useNavigate();
    const [autoAvatar, setAutoAvatar] = useState<string | null>(null);

    // Decide if provided avatarUrl is already a usable image reference
    let directAvatar: string | null = null;
    const isUsableUrl = (s: string) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:image/');

    if (typeof avatarUrl === 'string') {
        if (/^\d+$/.test(avatarUrl)) {
            // treat as picture id string
            directAvatar = `http://localhost:3000/picture/${avatarUrl}`;
        } else if (isUsableUrl(avatarUrl)) {
            directAvatar = avatarUrl;
        }
    } else if (typeof avatarUrl === 'number') {
        directAvatar = `http://localhost:3000/picture/${avatarUrl}`;
    } // ignore arrays / objects (likely raw byte arrays from backend) -> will fallback to fetch

    // Fetch first picture for this user if no explicit valid avatar
    useEffect(() => {
        if (directAvatar) return; // we already have a valid image
        let active = true;
        (async () => {
            try {
                const res = await fetch(`http://localhost:3000/user/${userId}/pictures`);
                if (!res.ok) return;
                const json = await res.json();
                let list: any[] = [];
                if (Array.isArray(json)) list = json; else if (Array.isArray(json.pictureIds)) list = json.pictureIds; else if (Array.isArray((json as any).pictures)) list = (json as any).pictures;
                const ids = list.map((d:any) => (typeof d === 'number' ? d : d?.id)).filter((id:any) => typeof id === 'number');
                if (active && ids.length > 0) setAutoAvatar(`http://localhost:3000/picture/${ids[0]}`);
            } catch { /* silent */ }
        })();
        return () => { active = false; };
    }, [directAvatar, userId]);

    const openChat = () => navigate(`/chat/${currentUserId}/${userId}`);
    const displayAvatar = directAvatar || autoAvatar;
    const initials = name?.charAt(0)?.toUpperCase() || "?";

    return (
        <div
            onClick={openChat}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:bg-gray-50 hover:shadow-md"
        >
            {/* Avatar */}
            <div className="relative">
                <Avatar size="lg" src={displayAvatar || undefined} initials={!displayAvatar ? initials : undefined} status={online ? 'online' : 'offline'} />
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
