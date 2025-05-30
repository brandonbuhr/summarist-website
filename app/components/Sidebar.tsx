"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@firebase/firebaseClient";

export default function Sidebar() {
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
      <input type="checkbox" id="sidebar-toggle" className="sidebar-checkbox" />

      <label htmlFor="sidebar-toggle" className="sidebar-hamburger">
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </label>

      <div className="sidebar-wrapper">
        <div className="sidebar">
          <div className="sidebar-top">
            <h1 className="sidebar-logo">📘 Summarist</h1>

            <ul className="sidebar-nav">
              <Link href="/for-you">
                <li>For you</li>
              </Link>
              <Link href="/my-library">
                <li>My Library</li>
              </Link>
              <Link href="/choose-plan">
                <li>Subscription</li>
              </Link>
              <Link href="/for-you">
                <li>Search</li>
              </Link>
            </ul>
          </div>

          <div className="sidebar-bottom">
            <ul className="sidebar-nav">
              <Link href="/settings">
                <li>Settings</li>
              </Link>
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
