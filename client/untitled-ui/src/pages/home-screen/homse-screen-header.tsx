import { User01 } from "@untitledui/icons";
import { useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { Avatar } from "@/components/base/avatar/avatar";
import { useEffect, useState } from "react";

const USER_ID = 2; // hardcoded user id (adjust if needed)

export const HomeScreenHeader = () => {
    const navigate = useNavigate();
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch(`http://localhost:3000/user/${USER_ID}/pictures`);
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

    const onClick = () => {
        navigate("/profile");
    };

    return (
        <div className="flex flex-row items-center justify-between">
            <div className="text-rightous flex justify-start text-2xl font-bold text-orange-500">loca</div>
            <div className="flex justify-end">
                <Button color="link-gray" className="p-2" noTextPadding={true} onClick={onClick}>
                    {/* Show avatar if we have an image, else fallback icon */}
                    {avatarSrc ? <Avatar size="md" src={avatarSrc} /> : <User01 />}
                </Button>
            </div>
        </div>
    );
};
