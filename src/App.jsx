import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <div className="font-display">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="register" element={<SignUp />} />
            <Route path="login" element={<SignIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
