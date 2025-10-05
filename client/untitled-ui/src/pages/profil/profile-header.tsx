import { useEffect, useState } from "react";
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
        <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{user.name}</span>
                <span className="text-md text-gray-500">{user.age}</span>
            </div>
            <Badge>{user.country}</Badge>
        </div>
    );
};
