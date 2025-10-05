import { ArrowLeft } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ProfileHeader } from "./profile-header";
import { ProfileImages } from "./profile-images";

export const Profile = () => {
    const onClick = () => {
        window.history.back();
    };

    return (
        <div className="flex max-w-89 flex-col gap-6 p-4">
            <div className="relative flex items-center justify-center rounded-3xl px-4 py-3 shadow-[0_8px_12px_-6px_rgba(0,0,0,0.25)]">
                <Button size="sm" color="link-gray" onClick={onClick} className="absolute left-2">
                    <ArrowLeft />
                </Button>
                My profile
            </div>

            <ProfileImages />

            <div className="flex w-full justify-start">
                <ProfileHeader />
            </div>
        </div>
    );
};
