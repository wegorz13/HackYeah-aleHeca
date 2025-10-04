import { Button } from "@/components/base/buttons/button";


type TripParams = {
  city: string;
  withName?: string;
  onClick?: () => void;
};

export function Trip({
  city,
  withName,

  onClick,


}: TripParams) {
  return (
    <Button
      onClick={onClick}
        className={
        "flex flex-col justify-begin w-full text-left rounded-2xl border border-gray-200 bg-white p-6 "}
    >
      <div>

        <p className="flex justify-begin itemst-center text-left text-black font-bold">{city}</p>
      {withName && (
        <p className="mb-4 text-sm text-gray-500 text-gray-400">
          {withName}
        </p>
      )}
      </div>

    </Button>
  );
}
