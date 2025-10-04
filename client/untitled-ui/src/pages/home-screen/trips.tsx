import { Trip } from "./trip";
import { useEffect, useState } from "react";




export const Trips = () => {
    const onClick = () => { 
        console.log("Trip clicked");
    }
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
        <div className="flex flex-col items-start gap-4 justify-begin font-bold items-center p-4 max-w-89">
           My trips
              {matches.map((match) => (
           <Trip  onClick={onClick} city={match.city} withName={match.name}
              ></Trip> ))}
        </div>
    );
};
