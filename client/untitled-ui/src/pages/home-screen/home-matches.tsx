import { useEffect, useState } from "react";
import { ArrowRight } from "@untitledui/icons";
import { useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { useUser } from "@/providers/id-provider";
import { Match } from "../matches/match";

export const HomeMatches = () => {
    const navigate = useNavigate();
    const { userId } = useUser();
    const [matches, setMatches] = useState<ApiMatch[]>([]);

    useEffect(() => {
        fetch(`http://localhost:3000/matches/${userId}`)
            .then((res) => res.json())
            .then((data: ApiMatch[]) => {
                setMatches(data);
            })
            .catch((err) => console.error(err));
    }, [userId]);

    return (
        <div className="justify-begin flex max-w-89 flex-col items-center items-start gap-4 p-4 font-bold">
            Your recent matches
            {matches.length > 0 && (
                <>
                    <Match
                        key={matches[0].userId}
                        name={matches[0].name}
                        role={matches[0].role}
                        description={matches[0].description}
                        currentUserId={userId ?? 0}
                        userId={matches[0].userId}
                        avatarUrl={matches[0].pictures?.[0]}
                        cityTag={matches[0].city}
                        online={true}
                        date={matches[0].date}
                    />

                    <Button size="sm"  color = "secondary" onClick={() => navigate("/matches")} className="flex flex-row w-full items-center gap-1 text-gray-500">
                       <div className="flex flex-row items-center gap-1">

                        View All Matches <ArrowRight />
                       </div>
                    </Button>
                </>
            )}
        </div>
    );
};
