"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdCloseCircle } from "react-icons/io";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@firebase/firebaseClient";
import { useAuthModal } from "@/context/AuthModalContext";

export default function LoginModal() {
  const { isOpen, closeModal } = useAuthModal();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/for-you");
      closeModal();
    } catch (err: any) {
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/user-not-found":
          setError("User not found.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid, "subscription", "status"), {
        isActive: false,
        plan: "Basic",
      });

      router.push("/for-you");
      closeModal();
    } catch (err: any) {
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        case "auth/email-already-in-use":
          setError("Email is already in use.");
          break;
        default:
          setError("Registration failed. Please try again.");
      }
    }
  };

  const handleGuestLogin = async () => {
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid, "subscription", "status"), {
        isActive: false,
        plan: "Basic",
      });

      router.push("/for-you");
      closeModal();
    } catch (err: any) {
      console.error(err);
      setError("Guest login failed.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={closeModal}>
          <IoMdCloseCircle />
        </button>

        <h2 className="modal-title">Login to Summarist</h2>

        <input
          className="modal-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="modal-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="modal-error">{error}</p>}

        <button className="modal-button primary" onClick={handleLogin}>
          Login
        </button>
        <button className="modal-button secondary" onClick={handleSignup}>
          Create Account
        </button>
        <button className="modal-button outline" onClick={handleGuestLogin}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
