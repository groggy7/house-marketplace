import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { serverTimestamp, setDoc, doc, getDoc } from "firebase/firestore";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function Login(email, password) {
    setLoading(true);
    try {
      const creds = await signInWithEmailAndPassword(auth, email, password);
      const user = await getDoc(doc(db, "users", creds.user.uid));

      setUser({
        id: creds.user.uid,
        email: creds.user.email,
        name: user.data().name,
      });

      navigate("/");
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async function Logout() {
    signOut(auth);
    setUser(null);
  }

  async function Register(name, email, password) {
    setLoading(true);
    try {
      const creds = await createUserWithEmailAndPassword(auth, email, password);
      const user = {
        name,
        email,
        userId: creds.user.uid,
        createdAt: serverTimestamp(),
      };

      setDoc(doc(db, "users", creds.user.uid), user);
      setUser({
        id: creds.user.uid,
        name: name,
        email: creds.user.email,
      });

      navigate("/");
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ Login, Register, Logout, user, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
