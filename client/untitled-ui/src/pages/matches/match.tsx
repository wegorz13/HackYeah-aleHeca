

type MatchParams = {
    name: string;
    role: string;
    description?: string;
};

export function Match({
    name,
    role,
    description

}: MatchParams) {
    return (
        <div className={"justify-begin flex w-full flex-col rounded-2xl border border-gray-200 bg-white p-6 text-left"}>
            <div>
                <p className="justify-begin itemst-center flex text-left font-bold text-black">{name}</p>
                <p className="mb-4 text-sm text-gray-400 text-gray-500">{role}</p>
                <p className="mb-4 text-sm text-gray-400 text-gray-500">{description}</p>
            </div>
        </div>
    );
}