import {MarkerPin01} from "@untitledui/icons";

export const UserCard = (prompts: any)=>{

    const name = prompts.profil.name;
    const age = prompts.profil.age;
    const city = prompts.profil.city;

    return (
        <div className="relative rounded-xl border w-3/4 h-120 p-4">
            <div className="bg-[#ebe9e6]">
                TU ZDJECIE
            </div>
            <div className="absolute bottom-0 left-0 right-0 rounded-xl border h-60">
                <div>
                    {name}
                    {age}
                    {city}
                </div>
                <span className="flex bg-[#e3dcd5] rounded-xl p-1 w-1/2">
                    <MarkerPin01></MarkerPin01>
                    portugal
                </span>
            </div>
        </div>
    )
}


