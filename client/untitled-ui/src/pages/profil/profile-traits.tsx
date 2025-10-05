import { useEffect, useState } from "react";

const USER_ID = 2;

const PALETTE = ["#FFEFD5", "#E0F7FA", "#E8F5E9", "#FFF9C4", "#F3E5F5", "#FCE4EC", "#E3F2FD", "#FFF3E0", "#F1F8E9", "#EDE7F6"];

function hashToColor(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length];
}

export const ProfileTraits = () => {
    const [traits, setTraits] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`http://localhost:3000/user/${USER_ID}/profile`);
                if (!res.ok) throw new Error("Failed to fetch profiles");
                const data = await res.json();
                if (!active) return;
                let list: any[] = [];
                if (Array.isArray(data)) list = data;
                else if (Array.isArray(data?.profiles)) list = data.profiles;
                else if (data) list = [data];
                const collected: string[] = [];
                list.forEach((item) => {
                    const raw = item?.traits || item?.trait || [];
                    if (Array.isArray(raw)) {
                        raw.forEach((t: any) => {
                            const name = typeof t === "string" ? t : t && typeof t === "object" && "name" in t ? t.name : null;
                            if (name && typeof name === "string") collected.push(name.trim());
                        });
                    } else if (typeof raw === "string") {
                        collected.push(raw.trim());
                    }
                });
                const unique = Array.from(new Set(collected.filter(Boolean)));
                setTraits(unique);
            } catch (e: any) {
                if (active) setError(e.message || "Error");
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="font-bold">What you like:</div>
            {loading && <div className="text-xs text-gray-400">Loading traits...</div>}
            {error && !loading && <div className="text-xs text-red-500">{error}</div>}
            {!loading && traits.length === 0 && !error && <div className="text-xs text-gray-400">No traits listed</div>}
            {/* Grid: max 3 per line */}
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}>
                {traits.map((t) => {
                    const bg = hashToColor(t);
                    return (
                        <div
                            key={t}
                            className="flex items-center justify-center truncate rounded-3xl px-1.5 py-1 text-[13px] font-medium text-gray-800 shadow-sm"
                            style={{ backgroundColor: bg }}
                            title={t}
                        >
                            {t}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProfileTraits;
