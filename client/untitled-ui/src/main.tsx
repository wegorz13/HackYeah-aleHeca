import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { HomeScreen } from "@/pages/home-screen/home-screen";
import { Profile } from "@/pages/profil/profile";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";
import {Explorer} from "@/pages/explorer.tsx";

const profiles = [
    { name: "Ola", age: 23, city: "Kraków", rating: 8 },
    { name: "Filip", age: 29, city: "Warszawa", rating: 6 },
    { name: "Natalia", age: 21, city: "Gdańsk", rating: 9 },
];

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <RouteProvider>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />\
                        <Route path="/explorer" element={<Explorer city="ola" profiles={profiles}/>} />
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </RouteProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>,
);
