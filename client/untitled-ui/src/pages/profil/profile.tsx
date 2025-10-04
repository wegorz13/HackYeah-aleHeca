
 import { Badge } from "@/components/base/badges/badges";
 import { ProfileHeader } from "./profile-header";
 import { ArrowLeft } from "@untitledui/icons";
 import { Button } from "@/components/base/buttons/button";
export const Profile = () => {

    const onClick = () => {
        window.history.back();
    }

    return (
        
        <div className="flex max-w-89 justify-between items-center p-4">
            <Button size="sm" color="link-gray" onClick={onClick}>
                <ArrowLeft/>
            </Button>
            <Badge type="pill-color" color="gray" size="lg">
                My profile
            </Badge>
            <ProfileHeader>
            </ProfileHeader>
        
        </div>
    );
};
