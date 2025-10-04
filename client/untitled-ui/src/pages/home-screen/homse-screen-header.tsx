import { Button } from "@/components/base/buttons/button";
import { useNavigate } from "react-router";
import { User01} from "@untitledui/icons";



export const HomeScreenHeader = () => {
    const navigate = useNavigate();
    const onClick = () => { 
        navigate("/profile")
    }
    return (
        
                <div className="flex flex-row justify-between items-center">

                <div className="flex justify-start font-bold text-2xl text-orange-500 text-rightous">
                    loca 
                </div>
                <div className="flex justify-end">
                    <Button color="link-gray" className="p-2" noTextPadding = {true} onClick={onClick}><User01></User01></Button>
                </div>
                </div>
              

        
       
   
    );
};
