import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import AuthProvider from "./context/AuthContext";

function App() {
  return (
    <div className="font-display">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="register" element={<SignUp />} />
              <Route path="login" element={<SignIn />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
