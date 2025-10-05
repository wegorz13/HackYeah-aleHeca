import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Chat from "@/pages/chat.tsx";
import { CreateProfile } from "@/pages/create-profile/create-profile";
import { Explorer } from "@/pages/explorer.tsx";
import { HomeScreen } from "@/pages/home-screen/home-screen";
import { Trips } from "@/pages/home-screen/trips";
import { Matches } from "@/pages/matches/matches";
import { Profile } from "@/pages/profil/profile";
import { UserProvider } from "@/providers/id-provider";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <RouteProvider>
                    <UserProvider initialUserId={2}>
                        <Routes>
                            <Route path="/" element={<HomeScreen />} />
                            <Route path="/explorer" element={<Explorer />} />
                            <Route path="/" element={<HomeScreen />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/trips" element={<Trips />} />
                            <Route path="/chat/:userId/:receiverId" element={<Chat />} />
                            <Route path="/matches" element={<Matches />} />
                            <Route path="/create-profile/:city" element={<CreateProfile />} />
                        </Routes>
                    </UserProvider>
                </RouteProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);
