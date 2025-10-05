import { useEffect, useState } from "react";
import { MarkerPin01 } from "@untitledui/icons";
import { useNavigate } from "react-router";
import AutosuggestInput from "./autosuggestInput";
import { HomeMatches } from "./home-matches";
import { HomeScreenHeader } from "./homse-screen-header";
import { YourTrips } from "./your-trips";
import { YourGuides } from "./your-guides";

export const HomeScreen = () => {
    const [cities, setCities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/cities`)
            .then((res) => res.json())
            .then((data) => setCities(data))
            .catch((err) => console.error(err));
    }, []);

    const onSelect = (value) => {
        navigate(`/create-profile/${value.label}`);
    };

    const cityName = cities.map((city) => city.name);
    console.log(cityName);

    return (
        <div className="flex max-w-89 items-center justify-center p-4 ">
            <div className="justify center flex max-w-200 flex-col gap-10">
                <HomeScreenHeader />

                <div className="text-center text-xl font-bold">
                    Where do you want to become <span className="text-orange-500">local?</span>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-amber-200 via-rose-200 to-orange-300 p-[7px] shadow">
                    <AutosuggestInput
                        placeholder="Where do you want to go?"
                        className="w-80 rounded-xl"
                        onSelect={onSelect}
                        inputClassName="bg-white border-0 focus:ring-0 shadow-none"
                        leftIcon={<MarkerPin01 className="h-4 w-4 text-gray-500" />}
                        getSuggestions={(q) => {
                            return cityName.filter((x) => x.toLowerCase().includes(q.toLowerCase())).map((label, i) => ({ id: i, label }));
                        }}
                    />
                </div>

                <YourTrips />
                <YourGuides />
                <HomeMatches />
            </div>
        </div>
    );
};
