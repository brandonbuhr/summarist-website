"use client";
import { TfiClose } from "react-icons/tfi";
import { TfiAlignJustify } from "react-icons/tfi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@firebase/firebaseClient";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="sidebar-toggle-btn">
        {isOpen ? <TfiClose /> : <TfiAlignJustify />}
      </button>

      <div className={`sidebar-wrapper ${isOpen ? "open" : ""}`}>
        <div className="sidebar">
          <div className="sidebar-top">
            <h1 className="sidebar-logo">📘 Summarist</h1>

            <ul className="sidebar-nav">
              <li>
                <Link href="/for-you">For you</Link>
              </li>
              <li>
                <Link href="/my-library">My Library</Link>
              </li>
              <li>
                <Link href="/choose-plan">Subscription</Link>
              </li>
              <li>
                <Link href="/for-you">Search</Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-bottom">
            <ul className="sidebar-nav">
              <li>
                <Link href="/settings">Settings</Link>
              </li>
              <li style={{ cursor: "not-allowed" }}>Help & Support</li>
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
