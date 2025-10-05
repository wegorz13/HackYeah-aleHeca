import {useEffect, useState} from "react";


export const SecondStep = () => {

    const [traits, setTraits] = useState([]);
    const [chosenTraits, setChosenTraits] = useState([]);

    function toggleTrait(trait:string){
        if(chosenTraits.length ===0){
            setChosenTraits(prevState => [...prevState, trait]);
        }
        else{
            if(chosenTraits.includes(trait)){
                const filtered = chosenTraits.filter(t => t !== trait);
                setChosenTraits(filtered);
            }
            else{
                setChosenTraits(prevState => [...prevState, trait]);
            }
        }
    }

    useEffect(() => {
        fetch("http://localhost:3000/traits")
            .then((res) => res.json())
            .then((data)=>
                setTraits(data))
            .catch((err) => console.error("Błąd przy pobieraniu:", err));
    },[]);

    return (
        <div>
            <div className="w-full flex flex-col items-start gap-1">
                <b className="text-sm text-lg text-left">I’m looking for</b>
                <p className="text-xs text-gray-600 text-left">Choose up to 5 more</p>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
                {traits.map((trait, index) => (
                    <button
                        key={index}
                        onClick={() => toggleTrait(trait.name)}
                        className={`rounded-xl px-2 py-1 text-center text-sm m-1 transition-colors duration-200
                          ${
                            chosenTraits.includes(trait.name)
                                ? "bg-orange-500 text-white"
                                : "bg-orange-100 text-black"
                            }`}
                    >
                        {trait.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
 
