import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, User01 } from "@untitledui/icons";
import { Tabs } from "@/components/application/tabs/tabs";
import { useUser } from "@/providers/id-provider";
import { Match } from "./match";
import { Avatar } from "@/components/base/avatar/avatar";

// Shape returned by the server /matches/:userId route
type ApiMatch = {
    name: string;
    role: string; // "mentor" | "traveller"
    description?: string;
    userId: number;
    city?: string;
    pictures?: string[];
    age?: number;
    traits?: string[];
    contact?: string;
    country?: string;
    date?: string;
};

// Dedupe helper to avoid repeated items when data is refetched
const uniqueByUserId = (arr: ApiMatch[]) => {
    const seen = new Set<number>();
    return arr.filter((m) => {
        const id = Number(m.userId);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
    });
};

export const Matches = () => {
    const { userId } = useUser();
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null); // added
    const [matches, setMatches] = useState<ApiMatch[]>([]);
    const [selectedTab, setSelectedTab] = useState<"traveling" | "guiding">("traveling");

    useEffect(() => {
        fetch(`http://localhost:3000/matches/${userId}`)
            .then((res) => res.json())
            .then((data: ApiMatch[]) => {
                // Replace, don't append; also dedupe just in case API returns duplicates
                setMatches(uniqueByUserId(data));
            })
            .catch((err) => console.error(err));
    }, [userId]);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch(`http://localhost:3000/user/${userId}/pictures`);
                if (!res.ok) return;
                const json = await res.json();
                let list: any[] = [];
                if (Array.isArray(json)) list = json;
                else if (Array.isArray(json.pictureIds)) list = json.pictureIds;
                else if (Array.isArray((json as any).pictures)) list = (json as any).pictures;
                const ids = list.map((d: any) => (typeof d === "number" ? d : d?.id)).filter((id: any) => typeof id === "number");
                if (ids.length > 0 && active) setAvatarSrc(`http://localhost:3000/picture/${ids[0]}`);
            } catch (_) {
                /* silent */
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    // Map tabs to roles returned by API

    const tabItems = useMemo(
        () => [
            { id: "traveling", children: "Traveling" },
            { id: "guiding", children: "Guiding" },
        ],
        [],
    );

    const filtered = useMemo(() => {
        return selectedTab === "traveling" ? matches.filter((m) => m.role === "mentor") : matches.filter((m) => m.role === "traveller");
    }, [matches, selectedTab]);

    return (
        <div className="flex max-w-89 flex-col items-center justify-center p-4">
            <div className="relative w-full flex items-center justify-center rounded-3xl px-4 py-3 shadow-[0_8px_12px_-6px_rgba(0,0,0,0.25)]">
                <div className="flex w-full items-center justify-center p-1">
                    <button onClick={() => (window.location.href = "/")} className="rounded-full p-2 hover:bg-gray-100">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex flex-1 justify-center">
                        Matches
                    </div>
                    {avatarSrc ? <Avatar size="md" alt="User" src={avatarSrc} /> : <User01 />}
                </div>
            </div>
            
            <div className="mx-auto flex w-full max-w-89 flex-col items-center p-4">
                {/* Connected horizontal tabs centered */}
                <div className="mb-4 flex w-full justify-center">
                    <Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as "traveling" | "guiding")} className="w-auto">
                        <Tabs.List type="button-border" size="sm" aria-label="Match type" items={tabItems} />
                    </Tabs>
                </div>
            </div>

            <div className="flex w-full flex-col items-stretch gap-4">
                {filtered.map((match) => (
                    <Match
                        key={match.userId}
                        name={match.name}
                        role={match.role}
                        description={match.description}
                        currentUserId={userId ?? 0}
                        userId={match.userId}
                        avatarUrl={match.pictures?.[0]}
                        cityTag={match.city}
                        online={true}
                        date={match.date}
                    />
                ))}
            </div>
        </div>
    );
};
