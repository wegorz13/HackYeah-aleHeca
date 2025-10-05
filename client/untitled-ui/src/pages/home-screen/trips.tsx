import { useEffect, useState } from "react";
import { useUser } from "@/providers/id-provider";
import { Trip } from "./trip";
import { Avatar } from "@/components/base/avatar/avatar";
import { ArrowLeft, User01 } from "@untitledui/icons";
import { useNavigate } from "react-router";
import { Button } from '@/components/base/buttons/button'

export const Trips = () => {
    const { userId } = useUser();
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null); // added
    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/profiles/${userId}`)
            .then((res) => res.json())
            .then((data) => setProfiles(data))
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

    const onClick = () => {
        navigate("/profile");
    }

    return (
        <div className="justify-begin flex max-w-89 flex-col items-center items-start p-4 font-bold gap-4">
            <div className="relative w-full flex items-center justify-center rounded-3xl px-4 py-3 shadow-[0_8px_12px_-6px_rgba(0,0,0,0.25)]">
                <div className="flex w-full items-center justify-center p-1">
                    <button onClick={() => (window.location.href = "/")} className="rounded-full p-2 hover:bg-gray-100">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex flex-1 justify-center">
                        My trips
                    </div>
                <Button color="link-gray" noTextPadding={true} onClick={onClick}>
                    {avatarSrc ? <Avatar size="md" alt="User" src={avatarSrc} /> : <User01 />}
                </Button>                </div>
            </div>
            {profiles.map((profile) => (
                <Trip city={profile.city} role={profile.role} profileId={profile.id}></Trip>
            ))}
        </div>
    );
};
