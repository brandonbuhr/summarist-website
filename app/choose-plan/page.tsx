"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@firebase/firebaseClient";
import Sidebar from "@/components/Sidebar";
import { useAuthModal } from "@/context/AuthModalContext";
import "/globals.css";

export default function ChoosePlan() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<"Basic" | "Premium" | null>(
    null
  );
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
        const subSnap = await getDoc(subRef);
        const data = subSnap.exists() ? subSnap.data() : null;
        setCurrentPlan(data?.plan ?? "Basic");
      } else {
        openModal();
      }
    });

    return () => unsubscribe();
  }, [openModal]);
  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout session was not created.");
      }
    } catch (err: any) {
      console.error("Stripe Checkout error:", err);
      alert(err.message || "Something went wrong. Please try again.");
    }
  };

  const renderPill = (plan: string) => {
    if (currentPlan === plan) {
      return <span className="plan-pill">Current Plan</span>;
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <h2>Choose Your Plan</h2>

        <div className="plan-container">
          <div className="plan-card-outline">
            <div className="plan-header">
              <h3>Basic</h3>
              {renderPill("Basic")}
            </div>
            <p>Free forever</p>
            <ul>
              <li>Access to free books</li>
              <li>Save to My Library</li>
            </ul>
          </div>

          {currentPlan !== "Premium" && (
            <button onClick={handleUpgrade}>
              <div className="plan-card-outline">
                <div className="plan-header">
                  <h3>Premium</h3>
                  {renderPill("Premium")}
                </div>
                <p>$9.99 / month</p>
                <ul>
                  <li>Access all premium books</li>
                  <li>Read and Listen instantly</li>
                  <li>Support the author</li>
                </ul>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
