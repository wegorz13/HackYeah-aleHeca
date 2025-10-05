import { useEffect, useState } from "react";

interface User {
    name?: string;
    age?: number;
    averageRating?: number | string;
    avgRating?: number | string;
    rating?: number | string;
}
interface ProfileRating {
    averageRating?: number | string;
    avgRating?: number | string;
    rating?: number | string;
}

export const ProfileHeader = () => {
    const userId = 2;
    const [user, setUser] = useState<User>({});
    const [avgRating, setAvgRating] = useState<string | null>(null);

    useEffect(() => {
        // Fetch user basic info
        fetch(`http://localhost:3000/user/${userId}`)
            .then((r) => r.json())
            .then((d) => setUser(d || {}))
            .catch((e) => console.error(e));
        // Fetch profiles for ratings
        fetch(`http://localhost:3000/user/${userId}/profile`)
            .then((r) => r.json())
            .then((data) => {
                if (!data) return;
                console.log("profile raw data:", data);

                const toNum = (v: any): number | null => {
                    if (v === null || v === undefined) return null;
                    const n = typeof v === "number" ? v : parseFloat(String(v));
                    return isNaN(n) ? null : n;
                };

                let ratings: number[] = [];

                if (Array.isArray(data)) {
                    ratings = data
                        .map((p: ProfileRating) => p.averageRating ?? p.avgRating ?? p.rating)
                        .map(toNum)
                        .filter((n: number | null): n is number => n !== null);
                } else if (Array.isArray(data.profiles)) {
                    ratings = data.profiles
                        .map((p: ProfileRating) => p.averageRating ?? p.avgRating ?? p.rating)
                        .map(toNum)
                        .filter((n: number | null): n is number => n !== null);
                } else {
                    // Single object case (your JSON example) that might itself carry averageRating
                    const single = toNum(data.averageRating ?? data.avgRating ?? data.rating);
                    if (single !== null) ratings = [single];
                }

                if (ratings.length === 0) {
                    console.warn("No ratings derived from payload");
                    return;
                }
                const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                setAvgRating(avg.toFixed(1));
            })
            .catch((e) => console.error(e));
    }, [userId]);

    return (
        <div className="flex w-full items-center gap-2">
            <div className="flex items-baseline gap-2">
                <div className="text-lg font-bold">{user.name}</div>
                <div className="text-md text-gray-500">{user.age}</div>
            </div>
            {avgRating && <div className="ml-auto rounded-3xl bg-amber-100 px-2 py-1 text-sm font-semibold text-yellow-700 shadow-sm">⭐ {avgRating}</div>}
        </div>
    );
};
