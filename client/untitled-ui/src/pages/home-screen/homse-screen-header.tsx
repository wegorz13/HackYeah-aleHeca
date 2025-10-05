import { ArrowLeft, User01 } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/id-provider";


export const HomeScreenHeader = () => {
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
    const { userId } = useUser();

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch(`http://localhost:3000/user/${userId}/pictures`);
                if (!res.ok) return;
                const json = await res.json();
                let list: any[] = [];
                // Accept multiple possible payload shapes
                if (Array.isArray(json)) list = json; 
                else if (Array.isArray(json.pictureIds)) list = json.pictureIds; 
                else if (Array.isArray((json as any).pictures)) list = (json as any).pictures;
                // Normalize to objects with id
                const ids = list
                    .map((d:any) => (typeof d === 'number' ? d : d?.id))
                    .filter((id:any) => typeof id === 'number');
                if (ids.length > 0 && active) {
                    setAvatarSrc(`http://localhost:3000/picture/${ids[0]}`);
                }
            } catch (e) {
                // silent fail -> fallback icon
            }
        })();
        return () => { active = false; };
    }, []);

    return (
        <div className="justify-begin flex max-w-89 flex-col items-center items-start p-4">
            <div className="relative flex w-full items-center justify-between rounded-3xl px-4 py-3 shadow-[0_8px_12px_-6px_rgba(0,0,0,0.25)]">
                <div className="text-rightous text-2xl font-bold text-orange-500">loca</div>
                {avatarSrc ? <Avatar size="md" alt="User" src={avatarSrc} /> : <User01 />}
            </div>
        </div>
    );
};
