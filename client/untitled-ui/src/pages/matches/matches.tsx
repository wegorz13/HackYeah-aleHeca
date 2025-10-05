import { useEffect, useState} from "react";
import { Match } from "./match";
import { Button } from "@/components/base/buttons/button";
import { ArrowLeft } from "@untitledui/icons";

export const Matches = () => {
    const userId = 2;
    const [matches, setMatches] = useState([]);
   

    useEffect(() => {
        fetch(`http://localhost:3000/matches/${userId}`)
            .then((res) => res.json())
            .then((data) => setMatches(data))
            .catch((err) => console.error(err));
    }, []);
    
     const onClick = () => {
        window.history.back();
    };


    console.log(matches);

    return (
        <div className="flex flex-col max-w-89 items-center justify-center p-4">
            <div className="text-2xl font-bold mb-3 color-gray-800">
            <Button
        size="sm"
        color="link-gray"
        onClick={onClick}
        className="flex absolute left-4 top-4"
      >
        <ArrowLeft />
      </Button>
            Your matches
            </div>
            <div className=" flex max-w-200 w-full flex-col gap-10">
              {matches.map((match) => (
                <Match name={match.name} role={match.role} description={match.description} ></Match>
              ))}
            </div>
        </div>
    );
};
