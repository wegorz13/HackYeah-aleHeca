import { useEffect, useState } from "react";
import { Trip } from "./trip";

export const Trips = () => {
    const onClick = () => {
        console.log("Trip clicked");
    };
    const userId = 2;

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/matches/${userId}`)
            .then((res) => res.json())
            .then((data) => setMatches(data))
            .catch((err) => console.error(err));
    }, [userId]);

    console.log(matches);
    return (
        <div className="justify-begin flex max-w-89 flex-col items-center items-start gap-4 p-4 font-bold">
            My trips
            {matches.map((match) => (
                <Trip onClick={onClick} city={match.city} withName={match.name}></Trip>
            ))}
        </div>
    );
};
