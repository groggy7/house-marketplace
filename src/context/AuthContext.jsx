import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
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
  const [loading, setLoading] = React.useState(true);
  const provider = new GoogleAuthProvider();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUser({
          id: user.uid,
          email: user.email,
          name: userDoc.data().name,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      return error;
    } finally {
      setLoading(false);
    }
  }

  async function GoogleLogin() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
      }

      setUser({
        id: user.uid,
        email: user.email,
        name: user.displayName,
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  async function Logout() {
    await signOut(auth);
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

      await setDoc(doc(db, "users", creds.user.uid), user);
      setUser({
        id: creds.user.uid,
        name: name,
        email: creds.user.email,
      });

      navigate("/");
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ Login, GoogleLogin, Register, Logout, user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
