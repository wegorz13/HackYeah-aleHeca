import { MarkerPin01 } from "@untitledui/icons";
import { Star01 } from "@untitledui/icons";

export const UserCard = (prompts: any) => {
    const name = prompts.profil.name;
    const age = prompts.profil.age;
    const averageRating = prompts.profil.averageRating;
    const country = prompts.profil.country;
    const description = prompts.profil.description;
    const traits = prompts.profil.traits;
    const pictures = prompts.profil.pictures[0];
    const date = prompts.profil.date;

    console.log(prompts.profil);

    const url = "https://picsum.photos/300/300";

    const buffer = {
        type: "Buffer",
        data: [
            104, 116, 116, 112, 115, 58, 47, 47, 108, 111, 114, 101, 109, 102, 108, 105, 99, 107, 114, 46, 99, 111, 109, 47, 51, 53, 50, 56, 47, 50, 54, 50, 57,
            63, 108, 111, 99, 107, 61, 53, 49, 57, 55, 50, 50, 51, 56, 48, 51, 54, 53, 49, 51, 55, 50,
        ],
    };

    // const url = String.fromCharCode(...buffer.data);

    console.log(url);

    return (
        <div className="w-9/10 overflow-hidden rounded-3xl bg-white">
            <div className="h-64 w-full">
                <img src={url} alt="zdjęcie" className="h-full w-full object-cover" />
            </div>

            <div className="shadow-gray-1000/20 border-t p-4 shadow-md">
                <div>
                    <div className="my-1 flex justify-between gap-3">
                        <div className="my-4 flex items-center gap-2">
                            <b>{name}</b>
                            <p>{age}</p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-2">
                            <Star01 className="text-orange-500" />
                            <b className="text-orange-dark-700">{averageRating.toFixed(2)}</b>
                        </div>
                    </div>
                </div>
                <p>{date}</p>

                <span className="flex w-1/2 items-center gap-1 rounded-xl bg-utility-gray-200 p-1">
                    <MarkerPin01 />
                    {country}
                </span>

                <div className="my-2">
                    <b className="my-2 text-sm">{description}</b>
                </div>

                <div className="my-4 flex flex-wrap gap-2">
                    {traits.map((trait, index) => (
                        <div key={index} className="inline-block rounded-xl bg-orange-100 px-2 py-1">
                            {trait}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
