import { useState } from "react";
import { ArrowLeft } from "@untitledui/icons";
import { useParams } from "react-router";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { FirstStep } from "./first-step";
import { SecondStep } from "./second-step";
import { ThirdStep } from "./third-step";

export const CreateProfile = () => {
    const { city } = useParams();
    console.log(city);
    const onClick = () => {
        window.history.back();
    };
    const [second, setSecond] = useState(false);
    const [third, setThird] = useState(false);
  
     const [arriving, setArriving] = useState("");
  const [leaving, setLeaving] = useState("");

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
    if (third) {
        saveData();
    }
    else if (second) {
      setThird(true);
    } else  {
      setSecond(true);
    }
  };

  const goPrevious = () => {
    if (second === false) {
        window.history.back();
    } else if (third === false) {
      setSecond(false);
    }
    else { setThird(false); }
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
