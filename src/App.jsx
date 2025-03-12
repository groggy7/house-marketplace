import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import SignIn from "./pages/SignIn";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Bookmarks from "./pages/Bookmarks";
import Bookings from "./pages/Bookings";
import Inbox from "./pages/Inbox";
import ListingForm from "./components/ListingForm";
import ListingDetail from "./pages/ListingDetail";
import Personal from "./pages/Personal";
import Security from "./pages/Security";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Search />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="profile">
              <Route index element={<Profile />} />
              <Route path="personal" element={<Personal />} />
              <Route path="security" element={<Security />} />
            </Route>
            <Route path="register" element={<SignUp />} />
            <Route path="login" element={<SignIn />} />
            <Route path="listings/create" element={<ListingForm />} />
            <Route path="listings/:listingID" element={<ListingDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
