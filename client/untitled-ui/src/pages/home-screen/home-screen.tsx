import { MarkerPin01 } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { HomeScreenHeader } from "./homse-screen-header";
import { Trips } from "./trips";

export const HomeScreen = () => {
    return (
        <div className="flex max-w-89 items-center justify-center p-4">
            <div className="justify center flex max-w-200 flex-col gap-10">
                <HomeScreenHeader />
                <div className="text-center text-xl font-bold">
                    Where do you want to become <span className="text-orange-500">local?</span>
                </div>
                <div className="rounded-md bg-gradient-to-r from-amber-200 via-rose-200 to-orange-300 p-[7px] shadow">
                    <Input type="search" icon={MarkerPin01} placeholder="Where do you want to go?" className="w-80"></Input>
                </div>
                <Trips />
            </div>
        </div>
    );
};
