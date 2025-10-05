
import { useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";

export const HomeMatches = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center">
            <Button className="bg-gradient-to-r from-amber-200 via-rose-200 to-orange-300 text-black" onClick={() => navigate('/matches')}>Go to Your Matches</Button>
        </div>
    );
};
