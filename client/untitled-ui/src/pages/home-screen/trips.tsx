import { Trip } from "./trip";




export const Trips = () => {
    const onClick = () => { 
        console.log("Trip clicked");
    }
    const userId = 2;
    
    return (
        <div className="flex flex-col items-start gap-4 justify-begin font-bold items-center p-4 max-w-89">
           My trips
           <Trip  onClick={onClick} city="Rome" withName="Igor"
              ></Trip>
        </div>
    );
};
