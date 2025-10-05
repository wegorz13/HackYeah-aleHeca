import React, { ReactNode, createContext, useContext, useState } from "react";

type UserContextValue = {
    userId: number | null;
    setUserId: (id: number | null) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children, initialUserId = null }: { children: ReactNode; initialUserId?: number | null }) {
    const [userId, setUserId] = useState<number | null>(initialUserId);
    return <UserContext.Provider value={{ userId, setUserId }}>{children}</UserContext.Provider>;
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
}
