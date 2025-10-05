import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Chat from "@/pages/chat.tsx";
import { CreateProfile } from "@/pages/create-profile/create-profile";
import { Explorer } from "@/pages/explorer.tsx";
import { HomeScreen } from "@/pages/home-screen/home-screen";
import { Matches } from "@/pages/matches/matches";
import { Profile } from "@/pages/profil/profile";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <RouteProvider>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/explorer" element={<Explorer city="ola" />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/chat/:userId/:receiverId" element={<Chat />} />
                        <Route path="/matches" element={<Matches />} />
                        <Route path="/create-profile/:city" element={<CreateProfile />} />
                    </Routes>
                </RouteProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);
