import { useState } from "react";
import { ArrowLeft } from "@untitledui/icons";
import { useParams } from "react-router";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { FirstStep } from "./first-step";
import { SecondStep } from "./second-step";
import { ThirdStep } from "./third-step";
import { useNavigate } from "react-router";

export const CreateProfile = () => {
    const { city } = useParams();
    console.log(city);
    const onClick = () => {
        window.history.back();
    };
<<<<<<< HEAD
=======
 
>>>>>>> 45924ac411b6ab1bf79d15a045e9fad219adca33
    const [second, setSecond] = useState(false);
    const [third, setThird] = useState(false);

    const [arriving, setArriving] = useState("");
    const [leaving, setLeaving] = useState("");
    const [additionalInfo, setAditionalInfo] = useState("");
    const [chosenTraits, setChosenTraits] = useState([""]);
    const [profileId, setProfileId] = useState(0);

    const navigate = useNavigate();
    const navigateExplorer = () => navigate("/explorer", { state: { city, role:"traveller", profileId } });

    function saveData() {
        const profileData = {
            userId: 2,
            city,
            date: [arriving, leaving].join(" - "),
            role: "traveller",
            traits: chosenTraits,
            description: additionalInfo,
        };
        console.log("💾 Saving profile data:", profileData);
        fetch("http://localhost:3000/profiles", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profileData),
        })
            .then((res) => res.json())
            .then((data) => { setProfileId(data.id); console.log(data.id) ; navigateExplorer(); })
                
            };

    

   const [additionalInfo, setAditionalInfo] = useState("");

 function saveData() {
     const profileData = {
    userId: 2,
    city,
    role: "traveler",
    traits: ["friendly", "open-minded", "curious"],
    description: additionalInfo,
  };
  console.log("💾 Saving profile data:", profileData);
  fetch("http://localhost:3000/profiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      profileData
    ),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(" Saved:", data);
    })
}

    const goNext = () => {
<<<<<<< HEAD
    if (third) {
        saveData();
    }
    else if (second) {
      setThird(true);
    } else  {
      setSecond(true);
    }
  };
=======
        if (third) {
            saveData();
        } else if (second) {
            setThird(true);
        } else  {
            setSecond(true);
        }
    };
>>>>>>> 45924ac411b6ab1bf79d15a045e9fad219adca33

    const goPrevious = () => {
        if (second === false) {
            window.history.back();
        } else if (third === false) {
            setSecond(false);
        } else {
            setThird(false);
        }
    };

    return (
        <div className="flex max-w-89 flex-col items-center justify-center gap-4 p-4">
            <Button size="sm" color="link-gray" onClick={onClick} className="absolute top-4 left-4 flex">
                <ArrowLeft />
            </Button>
            <Badge className="font-bold" size="md" color="gray">
                {city}
            </Badge>
            <div className="text-2xl font-bold">What are your plans for {city}?</div>
            <div className="flex w-full flex-row items-center gap-2">
<<<<<<< HEAD
                <ProgressBar className="bg-gray-200 [&>div]:bg-orange-500" min={0} max={100} value={100} />
                <ProgressBar className="bg-gray-200 [&>div]:bg-orange-500" min={0} max={100} value={second ? 100 : 0} />
                <ProgressBar className="bg-gray-200 [&>div]:bg-orange-500" min={0} max={100} value={third ? 100 : 0} />
            </div>
            <div className="flex flex-col gap-40 w-full">
         
            {second === false && <FirstStep arriving={arriving} setArriving={setArriving} leaving={leaving} setLeaving={setLeaving}/>}
            {second === true && third === false && <SecondStep />}
            {second === true && third === true && <ThirdStep additionalInfo={additionalInfo} setAdditionalInfo={setAditionalInfo}/>}
         
            <div className="flex w-full items-center gap-4">
                <Button onClick={goPrevious} size="sm" className="flex-1 rounded-md border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200">
=======
                <ProgressBar className="bg-gray-200 [&>div]:bg-orange-500" min={0} max={100} value={ 100 } />
                <ProgressBar className="bg-gray-200 [&>div]:bg-orange-500" min={0} max={100} value={second ? 100 : 0} />
                <ProgressBar className="bg-gray-200 [&>div]:bg-orange-500" min={0} max={100} value={third ? 100 : 0} />
            </div>
            {second === false && <FirstStep arriving={arriving} setArriving={setArriving} leaving={leaving} setLeaving={setLeaving} />}
            {second === true && third === false && <SecondStep chosenTraits={chosenTraits} setChosenTraits={setChosenTraits}/>}
            {second === true && third === true && <ThirdStep additionalInfo={additionalInfo} setAdditionalInfo={setAditionalInfo} />}
            <div className="absolute right-0 bottom-0 left-0 my-5 flex w-full items-center gap-4 p-4">
                <Button
                    onClick={goPrevious}
                    size="sm"
                    className="flex-1 rounded-md border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                >
>>>>>>> 45924ac411b6ab1bf79d15a045e9fad219adca33
                    Previous
                </Button>

                <Button onClick={goNext} size="sm" className="flex-1 rounded-md bg-orange-500 px-3 py-1 text-sm text-white hover:bg-orange-600">
                    Next
                </Button>
            </div>
            </div>
        </div>
    );
};
