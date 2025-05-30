"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@firebase/firebaseClient";
import Sidebar from "@/components/Sidebar";
import { useAuthModal } from "@/context/AuthModalContext";

export default function ChoosePlan() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
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

  const handleUpgrade = async (planType: string) => {
    if (!user) return openModal();

    try {
      const subRef = doc(db, "users", user.uid, "subscription", "status");
      const selectedPlan =
        planType === "basic"
          ? "Basic"
          : planType === "annual"
          ? "Premium-Annual"
          : "Premium";

      await setDoc(subRef, {
        isActive: selectedPlan !== "Basic",
        plan: selectedPlan,
        updatedAt: new Date().toISOString(),
      });

      alert(
        "Plan changed to " +
          selectedPlan +
          "\nThis is a demo app, so no actual payment will be processed."
      );
      setCurrentPlan(selectedPlan);
    } catch (err) {
      console.error("Upgrade failed:", err);
      alert("Failed to change plan. Try again.");
    }
  };

  const renderPill = (plan: string) =>
    currentPlan === plan ? (
      <span className="plan-pill">Current Plan</span>
    ) : null;

  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <h2>Choose Your Plan</h2>

        <div className="plan-container">
          <button
            onClick={() => handleUpgrade("basic")}
            disabled={currentPlan === "Basic"}
          >
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
          </button>

          <button
            onClick={() => handleUpgrade("monthly")}
            disabled={currentPlan === "Premium"}
          >
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

          <button
            onClick={() => handleUpgrade("annual")}
            disabled={currentPlan === "Premium-Annual"}
          >
            <div className="plan-card-outline">
              <div className="plan-header">
                <h3>Premium Annual</h3>
                {renderPill("Premium-Annual")}
              </div>
              <p>$107.89 / year (Save 10%)</p>
              <ul>
                <li>All Premium features</li>
                <li>Billed once annually</li>
                <li>Best value</li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
