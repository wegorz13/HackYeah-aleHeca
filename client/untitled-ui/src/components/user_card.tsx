import {MarkerPin01} from "@untitledui/icons";
import {Star01} from "@untitledui/icons";

export const UserCard = (prompts: any)=>{

    const name = prompts.profil.name;
    const age = prompts.profil.age;
    const averageRating = prompts.profil.averageRating;
    const country = prompts.profil.country;
    const description = prompts.profil.description;
    const traits = prompts.profil.traits;
    const pictures = prompts.profil.pictures[0];


    const url = "https://picsum.photos/300/300";

    const buffer = {
        type: "Buffer",
        data: [104,116,116,112,115,58,47,47,108,111,114,101,109,102,108,105,99,107,114,46,99,111,109,47,51,53,50,56,47,50,54,50,57,63,108,111,99,107,61,53,49,57,55,50,50,51,56,48,51,54,53,49,51,55,50]
    };

    // const url = String.fromCharCode(...buffer.data);

    console.log(url);

    return (
        <div className="rounded-3xl w-9/10 bg-white overflow-hidden">
            <div className="w-full h-64">
                <img
                    src={url}
                    alt="zdjęcie"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-4 border-t shadow-md shadow-gray-1000/20">
                <div >
                    <div className="flex justify-between gap-3 my-1">
                        <div className="flex gap-2 items-center my-4">
                            <b>{name}</b>
                            <p>{age}</p>
                        </div>
                        <div className="px-2 bg-orange-50 inline-flex gap-2 items-center rounded-lg">
                            <Star01 className="text-orange-500"/>
                            <b className="text-orange-dark-700">{averageRating.toFixed(2)}</b>
                        </div>
                    </div>
                </div>

                <span className="flex bg-utility-gray-200 rounded-xl p-1 w-1/2 gap-1 items-center">
                  <MarkerPin01/>
                    {country}
                </span>

                <div className="my-2">
                    <b className="text-sm my-2">{description}</b>
                </div>

                <div className="flex gap-2 flex-wrap my-4">
                    {traits.map((trait, index) => (
                        <div
                            key={index}
                            className="inline-block rounded-xl bg-orange-100 px-2 py-1"
                        >
                            {trait}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}


