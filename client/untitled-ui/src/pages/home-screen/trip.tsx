import { useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";

type TripParams = {
    city: string;
    role: string;
    date: string;
    profileId: number;
};

export function Trip({ city, role, date, profileId }: TripParams) {
    const navigate = useNavigate();
    const onClick = () => navigate("/explorer", { state: { city, role, profileId } });
    return (
        <Button onClick={onClick} className={"justify-begin flex w-full flex-col rounded-2xl border border-gray-200 bg-white p-2 text-left"}>
            <div className="flex flex-row items-center gap-3">
                <p className="justify-begin flex text-left font-bold text-black">{city}</p>
            </div>
            <p className="justify-begin itemst-center flex text-left font-bold text-gray-400">{date}</p>
        </Button>
    );
}
