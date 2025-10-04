import { Input } from "@/components/base/input/input";
import { MarkerPin01} from "@untitledui/icons";
import { Trips } from "./trips";
import { HomeScreenHeader } from "./homse-screen-header";

export const HomeScreen = () => {

    return (
        
        <div className="flex justify-center items-center p-4 max-w-89">
           
            <div className="flex flex-col max-w-200 justify center gap-10">
        <HomeScreenHeader/>
                <div className="font-bold text-xl text-center">
      Where do you want to become <span className="text-orange-500">local?</span>
    </div>
     <div className="rounded-md p-[7px] bg-gradient-to-r from-amber-200 via-rose-200 to-orange-300 shadow">
        
                <Input type = "search" icon={MarkerPin01} placeholder="Where do you want to go?" className="w-80" >
                </Input>
     </div>

                <Trips />

        
               
            </div>
            
        </div>
    );
};
