
 import { useState, useEffect } from "react";
 import { Badge } from "@/components/base/badges/badges";

export const ProfileHeader = () => {
    const userId = 2;
    
 
     const [user, setUser] = useState([]);
    
        useEffect(() => {
            fetch(`http://localhost:3000/user/${userId}`)
                .then((res) => res.json())
                .then((data) => setUser(data))
                .catch((err) => console.error(err));
        }, [userId]);
    
        console.log(user);
    return (
        
        <div className="flex flex-row items-center gap-3  ">
            <div className="text-lg font-bold">
            {user.name} 
                </div>
            <div className="text-gray-500 text-md ml-2">
                {user.age}
            </div>
        </div>
    );
};