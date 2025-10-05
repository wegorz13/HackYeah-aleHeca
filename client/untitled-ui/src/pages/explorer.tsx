import { useEffect, useState } from "react";
import { MarkerPin01 } from "@untitledui/icons";
import { ArrowLeft } from "@untitledui/icons";
import { useLocation } from "react-router";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { UserCard } from "@/components/user_card.tsx";

export const Explorer = (prompts: any) => {
    const [profiles, setProfiles] = useState([]);
    const [index, setIndex] = useState(0);

    const { state } = useLocation() as { state?: { city: string; role: string; profileId: number } };

    if (!state) throw new Error("Missing navigation state with city, role, profileId");

    const queryParams = new URLSearchParams({
        city: state.city,
        role: state.role,
        profileId: state.profileId.toString(),
    });

    console.log("Navigation state:", state, queryParams, profiles);
    useEffect(() => {
        fetch(`http://localhost:3000/profiles/search?${queryParams.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setProfiles(data);
            })
            .catch((err) => console.error("Błąd przy pobieraniu:", err));
    }, []);

    if (profiles.length === 0) {
        return (
            <div className="flex flex-col items-start gap-8 md:flex-row md:gap-16">
                <LoadingIndicator type="line-spinner" size="md" label="Loading..." />
            </div>
        );
    }
    const next_profil = () => {
        setIndex((prev) => (prev + 1) % profiles.length);
    };

    return (
        <div className="rows items-center justify-center gap-2">
            <div className="shadow-gray-1000/1000 m-7 rounded-3xl bg-white shadow-md">
                <div className="flex w-full items-center justify-center p-1">
                    <button onClick={() => (window.location.href = "/")} className="rounded-full p-2 hover:bg-gray-100">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex flex-1 justify-center">
                        <span className="flex w-1/2 justify-center gap-6 rounded-xl bg-neutral-100 px-2 py-1">
                            <MarkerPin01 />
                            {prompts.city}
                        </span>
                    </div>
                    <Avatar size="sm" alt="Olivia Rhye" src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" />
                </div>
            </div>
            <div className="row flex items-center justify-center">
                <UserCard profil={profiles[index]}></UserCard>
            </div>
            <div className="flex justify-center gap-5">
                <Button className="border-color-grey-500 text-color-black w-9/20 bg-white" onClick={() => next_profil()}>
                    Skip
                </Button>
                <Button className="border-color-500 w-9/20 bg-orange-500" onClick={() => next_profil()}>
                    Like
                </Button>
            </div>
        </div>
    );
};
