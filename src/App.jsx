import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="font-display bg-gray-200">
      <BrowserRouter>
        <div className="text-3xl text-red-600 text-center">Hello world</div>
        <Navbar />
      </BrowserRouter>
    </div>
  );
}

export default App;
