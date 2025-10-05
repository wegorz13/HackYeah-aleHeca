import { useEffect, useState } from "react";
import { ArrowLeft, MarkerPin01, User01 } from "@untitledui/icons";
import { useLocation, useNavigate } from "react-router";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { UserCard } from "@/components/user_card.tsx";
import { useUser } from "@/providers/id-provider.tsx";

type ProfileItem = { id: number } & Record<string, any>;

export const Explorer = () => {
    const [profiles, setProfiles] = useState<ProfileItem[]>([]);
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
    const { userId } = useUser();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const onClick = () => {
        navigate("/profile");
    };

    const { state } = useLocation() as { state?: { city: string; role: string; profileId: number } };

    if (!state) throw new Error("Missing navigation state with city, role, profileId");

    const queryParams = new URLSearchParams({
        city: state.city,
        role: state.role,
        profileId: state.profileId.toString(),
    });

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/profiles/search?${queryParams.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setProfiles(data);
                setMessage(data.length === 0 ? "No profiles found" : "");
            })
            .catch((err) => console.error("Błąd przy pobieraniu:", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (userId == null) return;
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
            } catch (_) {}
        })();
        return () => {
            active = false;
        };
    }, [userId]);

    if (loading) {
        return (
            <div className="flex flex-col items-start gap-8 md:flex-row md:gap-16">
                <LoadingIndicator type="line-spinner" size="md" label="Loading..." />
            </div>
        );
    }

    if (profiles.length === 0) {
        return <div className="text-center text-lg font-medium text-gray-500">{message || "No profiles left"}</div>;
    }

    const update_profiles = (profileId: number) => {
        setProfiles((prev) => {
            const next = prev.filter((profile) => profile.id !== profileId);
            if (next.length === 0) setMessage("No profiles left");
            return next;
        });
    };

    function like(profileId: number) {
        fetch("http://localhost:3000/like", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                likerRole: state?.role,
                likerId: state?.profileId,
                profileId: profileId,
            }),
        });
    }

    return (
        <div className="rows max-w-89 items-center justify-center gap-2">
            <div className="shadow-gray-1000/1000 m-2 m-7 rounded-3xl bg-white shadow-md">
                <div className="flex w-full items-center justify-center p-1">
                    <button onClick={() => window.history.back()} className="rounded-full p-2 hover:bg-gray-100">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex flex-1 justify-center">
                        <span className="flex w-1/2 justify-center gap-6 rounded-xl bg-neutral-100 px-2 py-1">
                            <MarkerPin01 />
                            {state.city}
                        </span>
                    </div>
                    <Button color="link-gray" noTextPadding={true} onClick={onClick}>
                        {avatarSrc ? <Avatar size="md" alt="User" src={avatarSrc} /> : <User01 />}
                    </Button>{" "}
                </div>
            </div>
            <div className="row flex items-center justify-center">
                <UserCard profil={profiles[0]}></UserCard>
            </div>
            <div className="absolute right-0 bottom-0 left-0 my-5 flex w-full max-w-89 items-center gap-4 p-4">
                <Button
                    className="border-color-grey-500 text-color-black w-9/20 bg-white"
                    onClick={() => {
                        const current = profiles[0];
                        if (!current) return;
                        update_profiles(current.id);
                    }}
                >
                    Skip
                </Button>
                <Button
                    className="border-color-500 w-10/20 bg-orange-500"
                    onClick={() => {
                        const current = profiles[0];
                        if (!current) return;
                        update_profiles(current.id);
                        like(current.id);
                    }}
                >
                    Like
                </Button>
            </div>
        </div>
    );
};
