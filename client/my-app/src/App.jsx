import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />      
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Ale Heca</h1>
    </div>
  );
}