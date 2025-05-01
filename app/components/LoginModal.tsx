import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          <IoMdCloseCircle />
        </button>

        <h2 className="text-xl font-bold mb-4">Login to Summarist</h2>

        <input
          className="input mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button className="btn-primary w-full mb-2" onClick={handleLogin}>
          Login
        </button>
        <button className="btn-secondary w-full mb-2" onClick={handleSignup}>
          Create Account
        </button>
        <button className="btn-outline w-full mb-2" onClick={handleGuestLogin}>
          Continue as Guest
        </button>
        <button className="btn-danger w-full" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
