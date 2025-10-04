import { User01 } from "@untitledui/icons";
import { useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";

export const HomeScreenHeader = () => {
    const navigate = useNavigate();
    const onClick = () => {
        navigate("/profile");
    };
    return (
        <div className="flex flex-row items-center justify-between">
            <div className="text-rightous flex justify-start text-2xl font-bold text-orange-500">loca</div>
            <div className="flex justify-end">
                <Button color="link-gray" className="p-2" noTextPadding={true} onClick={onClick}>
                    <User01></User01>
                </Button>
            </div>
        </div>
    );
};
