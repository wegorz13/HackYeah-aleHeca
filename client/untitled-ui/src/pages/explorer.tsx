import {MarkerPin01} from "@untitledui/icons";
import {UserCard} from "@/components/user_card.tsx";
import { Button } from "@/components/base/buttons/button";
import {useEffect, useState} from "react";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Avatar } from "@/components/base/avatar/avatar";
import {ArrowLeft} from "@untitledui/icons";

export const Explorer =  (prompts: any) => {
    const [profiles, setProfiles] = useState([]);
    const [profile, setProfile] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3000/profiles/profile")
            .then((res) => res.json())
            .then((data)=>{
                setProfile(data[0]);
            })
            .catch((err) => console.error("Błąd przy pobieraniu:", err));
    },[]);

    useEffect(() => {
        fetch("http://localhost:3000/profiles")
            .then((res) => res.json())
            .then((data)=>{
                const filtered = data.filter((item: { city: any; })=> item.city === prompts.city);
                setProfiles(filtered);
            })
            .catch((err) => console.error("Błąd przy pobieraniu:", err));
        },[]);

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
            <div className="bg-white rounded-3xl shadow-md shadow-gray-1000/1000 m-7">
                <div className="flex items-center justify-center w-full p-1 ">
                    <button
                        onClick={() => window.location.href = "/"}
                        className="p-2 rounded-full hover:bg-gray-100 ">
                        <ArrowLeft className="w-5 h-5"/>
                    </button>
                    <div className="flex justify-center flex-1">
                    <span className="flex bg-neutral-100 rounded-xl px-2 py-1 gap-6 w-1/2 justify-center">
                      <MarkerPin01/>
                        {prompts.city}
                    </span>
                    </div>
                    <Avatar size="sm" alt="Olivia Rhye"
                            src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"/>
                </div>
            </div>
            <div className="flex row items-center justify-center">
                <UserCard profil={profiles[index]}></UserCard>
            </div>
            <div className="flex justify-center gap-5">
                <Button className="bg-white border-color-grey-500 text-color-black w-9/20" onClick={() => next_profil()}>
                    Skip
                </Button>
                <Button className="bg-orange-500 border-color-500 w-9/20" onClick={() => next_profil()}>
                    Like
                </Button>
            </div>

        </div>
    );
}