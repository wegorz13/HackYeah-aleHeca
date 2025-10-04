import { Button } from "@/components/base/buttons/button";

type TripParams = {
    city: string;
    role: string;
    onClick?: () => void;
};

export function Trip({
    city,
    role,
    onClick,
}: TripParams) {
    return (
        <Button onClick={onClick} className={"justify-begin flex w-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-left"}>
            <div>
                <p className="justify-begin itemst-center flex text-left font-bold text-black">{city}</p>
                <p className="mb-4 text-sm text-gray-400 text-gray-500">{role}</p>
            </div>
        </Button>
    );
}
