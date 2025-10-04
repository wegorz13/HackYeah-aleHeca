import {MarkerPin01} from "@untitledui/icons";
import {Avatar} from "@/components/base/avatar/avatar.tsx";
import {UserCard} from "@/components/user_card.tsx";
import {ArrowRight} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import {useState} from "react";

export const Explorer = (prompts: any)=>{

    const users_len = prompts.profiles.length;
    const [index, setIndex] = useState(0);


    function next_profil(){
        if(index<users_len){
            setIndex(prevState => prevState + 1);
        }
    }

    return (
        <div className="rows items-center justify-center bg-white gap-2">
            <div className=" flex row items-center justify-center">
                <span className="flex bg-[#e8e6e3] rounded-xl px-3 py-2 w-1/3 m-3 gap-3">
                    <MarkerPin01></MarkerPin01>
                    {prompts.city}
                </span>
                <Avatar/>
            </div>
            <div className="flex row items-center justify-center">
                <UserCard profil={prompts.profiles[index]}></UserCard>
                <Button className="bg-primary" onClick={()=>next_profil()}>
                    <ArrowRight></ArrowRight>
                </Button>
            </div>
        </div>
    );
}