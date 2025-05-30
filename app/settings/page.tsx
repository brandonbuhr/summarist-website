"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@firebase/firebaseClient";
import Sidebar from "@/components/Sidebar";
import { useAuthModal } from "@/context/AuthModalContext";
import "/globals.css";
import SearchBar from "@/components/SearchBar";

type PlanType = "basic" | "premium" | "premium-plus";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState<PlanType | null>(null);
  const [loading, setLoading] = useState(true);
  const { openModal } = useAuthModal();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const subRef = doc(
          db,
          "users",
          firebaseUser.uid,
          "subscription",
          "status"
        );

        try {
          const subSnap = await getDoc(subRef);
          if (subSnap.exists()) {
            const data = subSnap.data();
            const planType = (data.plan?.toLowerCase() || "basic") as PlanType;
            setPlan(planType);
          } else {
            setPlan("basic");
          }
        } catch (err) {
          console.error("Failed to fetch subscription status:", err);
          setPlan("basic");
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div>
        <SearchBar />
      </div>
      <div className="content-container">
        <h2>Settings</h2>

        {loading ? (
          <p>Loading...</p>
        ) : !user ? (
          <div className="not-logged-in">
            <img src="/login-placeholder.png" alt="Please log in" width="200" />
            <p>You’re not logged in.</p>
            <button className="primary-button" onClick={openModal}>
              Log In
            </button>
          </div>
        ) : (
          <div className="settings-panel">
            <div className="settings-item">
              <h4>Subscription Plan</h4>
              <p
                className="plan-label"
                style={{ color: "green", fontWeight: "bold" }}
              >
                {plan}
              </p>
              <button
                className="plan-button"
                onClick={() => (window.location.href = "/choose-plan")}
              >
                Change Subscription Plan
              </button>
            </div>

            <div className="settings-item">
              <h4>Email</h4>
              {user.email ? (
                <p>{user.email}</p>
              ) : (
                <p className="muted">No email available (guest login)</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
