import {useState} from "react";

export const ThirdStep = () => {

    const [description, setDescription] = useState("");

    return (
        <div className="w-full flex flex-col items-start gap-1">
            <p>Additional info</p>
            <textarea
                className="border border-gray-500 rounded p-2 w-full"
                placeholder="Enter a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea></div>
    ); 
}
 
