import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "@untitledui/icons";
import { Tabs } from "@/components/application/tabs/tabs";
import { Button } from "@/components/base/buttons/button";
import { useUser } from "@/providers/id-provider";
import { Match } from "./match";

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

export const Matches = () => {
    const { userId } = useUser();
    const [matches, setMatches] = useState<ApiMatch[]>([]);
    const [selectedTab, setSelectedTab] = useState<"traveling" | "guiding">("traveling");

    useEffect(() => {
        fetch(`http://localhost:3000/matches/${userId}`)
            .then((res) => res.json())
            .then((data: ApiMatch[]) => setMatches(data))
            .catch((err) => console.error(err));
    }, [userId]);

    const onClick = () => {
        window.history.back();
    };

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
    }, [selectedTab]);

    return (
        <div className="flex max-w-100 flex-col items-center justify-center p-4">
            <div className="mx-auto flex w-full max-w-100 flex-col items-center p-4">
                <div className="color-gray-800 mb-2 text-center text-2xl font-bold">
                    <Button size="sm" color="link-gray" onClick={onClick} className="absolute top-4 left-4 flex">
                        <ArrowLeft />
                    </Button>
                    Matches
                </div>

                {/* Connected horizontal tabs centered */}
                <div className="mb-4 flex w-full justify-center">
                    <Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as "traveling" | "guiding")} className="w-auto">
                        <Tabs.List type="button-border" size="sm" aria-label="Match type" items={tabItems} />
                    </Tabs>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-200 flex-col items-stretch gap-4">
                {filtered.map((match) => (
                    <Match
                        key={match.userId}
                        name={match.name}
                        role={match.role}
                        description={match.description}
                        currentUserId={userId}
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
