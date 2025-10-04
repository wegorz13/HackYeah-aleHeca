import { useEffect, useState } from "react";
import { Trip } from "./trip";

export const Trips = () => {
    const onClick = () => {
        console.log("Trip clicked");
    };
    const userId = 2;

    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/profiles/${userId}`)
            .then((res) => res.json())
            .then((data) => setProfiles(data))
            .catch((err) => console.error(err));
    }, [userId]);

    console.log(profiles[0]);
    return (
        <div className="justify-begin flex max-w-89 flex-col items-center items-start gap-4 p-4 font-bold">
            Planing my trips
            {profiles.map((profile) => (
                <Trip onClick={onClick} city={profile.city} role={profile.role}></Trip>
            ))}
        </div>
    );
};
