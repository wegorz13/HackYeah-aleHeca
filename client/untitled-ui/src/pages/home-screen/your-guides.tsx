import { useEffect, useState } from "react";
import { ArrowRight } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { useUser } from "@/providers/id-provider";
import { useNavigate } from "react-router";
import { profile } from "console";

export const YourGuides = () => {
    const { userId } = useUser();
  

    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate();
    const navigateExplorer = () => navigate("/explorer", { state: { city: profiles[0].city, role:"mentor", profileId: profiles[0].id } });

    useEffect(() => {
        fetch(`http://localhost:3000/profiles/${userId}`)
            .then((res) => res.json())
            .then((data) => setProfiles(data.filter(profile => profile.role === "mentor")))
            .catch((err) => console.error(err));
    }, [userId]);

    const onClick = () => {navigateExplorer()};

    console.log(profiles);
    return (
        <div className="justify-begin flex max-w-89 flex-col items-center items-start gap-4 p-4 font-bold">
            Your Guides
            {profiles.length > 0 && (
                <div
                    className={
                        "justify-begin justify-begin flex w-full flex-col flex-row items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 text-left"
                    }
                >
                    <div className="flex w-full flex-row items-center justify-between p-2">
                        <div className="flex flex-row items-center gap-2">
                            <Badge>{profiles[0].city}</Badge>
                            <p className="text-sm text-gray-500">{profiles[0].date}</p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <Badge className="text-orange-500">{profiles.length - 1} more trips!</Badge>
                            <Button size="sm" color="link-gray" onClick={onClick} className="text-gray-500">
                                <ArrowRight />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
