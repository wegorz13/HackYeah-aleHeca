import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/login" element={<Home/>}/>
            </Routes>
        </div>
    );
}


function Home() {
    return <h1>Ale heca</h1>;
}

function About() {
    return <h1>O nas</h1>;
}

export default App;

