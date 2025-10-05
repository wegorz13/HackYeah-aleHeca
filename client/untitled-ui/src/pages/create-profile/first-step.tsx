type FirstStepProps = {
    arriving: string;
    setArriving: (date: string) => void;
    leaving: string;
    setLeaving: (date: string) => void;
};

export const FirstStep = ({ arriving, setArriving, leaving, setLeaving }: FirstStepProps) => {
    return (
        <>
            <div className="flex w-full flex-col gap-4">
                <h3 className="text-sm font-medium text-gray-900">Date of stay</h3>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Arriving at</label>
                    <input
                        type="date"
                        value={arriving}
                        onChange={(e) => setArriving(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Leaving at</label>
                    <input
                        type="date"
                        value={leaving}
                        onChange={(e) => setLeaving(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                </div>
            </div>
        </>
    );
};
