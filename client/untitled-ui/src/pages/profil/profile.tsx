import { ArrowLeft } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ProfileHeader } from "./profile-header";

export const Profile = () => {
    const onClick = () => {
        window.history.back();
    };

   return (
  <div className="flex max-w-89 flex-col gap-6 p-4">
    <div className="relative flex items-center justify-center">
      <Button
        size="sm"
        color="link-gray"
        onClick={onClick}
        className="absolute left-0"
      >
        <ArrowLeft />
      </Button>
      <Badge type="pill-color" color="gray" size="lg">
        My profile
      </Badge>
    </div>
    <div className="flex justify-start w-full">
      <ProfileHeader />
    </div>
  </div>
);
};
