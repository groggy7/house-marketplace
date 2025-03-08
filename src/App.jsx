import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import SignIn from "./pages/SignIn";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Starred from "./pages/Starred";
import Bookings from "./pages/Bookings";
import Inbox from "./pages/Inbox";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Search />} />
            <Route path="bookmarks" element={<Starred />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="profile" element={<Profile />} />
            <Route path="register" element={<SignUp />} />
            <Route path="login" element={<SignIn />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
