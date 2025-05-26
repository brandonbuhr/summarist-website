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
        </div>
      </div>
    </div>
  );
}
