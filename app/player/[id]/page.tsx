"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "@firebase/firebaseClient";
import { useAuthModal } from "@/context/AuthModalContext";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";

interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: string;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState("basic");
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const subRef = doc(
          db,
          "users",
          firebaseUser.uid,
          "subscription",
          "status"
        );
        const subSnap = await getDoc(subRef);
        const data = subSnap.exists() ? subSnap.data() : null;
        const userPlan = (data?.plan?.toLowerCase() || "basic") as string;
        setPlan(userPlan);
      }
      setCheckingAccess(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${params.id}`
        );
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Failed to fetch book:", err);
      }
    };

    if (params?.id) fetchBook();
  }, [params?.id]);

  useEffect(() => {
    if (!checkingAccess && book && user) {
      const hasAccess = ["premium", "premium-annual"].includes(plan);
      if (book.subscriptionRequired && !hasAccess) {
        router.push("/choose-plan");
      }
    }
  }, [book, plan, checkingAccess, router, user]);

  if (!book) return <p>Loading book...</p>;

  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div>
        <SearchBar />
      </div>
      <div className="content-container">
        <button
          className="back-button"
          onClick={() => router.push(`/book/${params.id}`)}
        >
          ← Go back to book
        </button>

        <h1>{book.title}</h1>
        <p className="player-subtitle">{book.subTitle}</p>
        <p className="player-author">By {book.author}</p>

        {book.type.includes("Audio") && (
          <audio
            controls
            src={book.audioLink}
            style={{ marginTop: "20px", width: "100%" }}
          >
            Your browser does not support the audio element.
          </audio>
        )}

        {book.type.includes("Text") && (
          <>
            <h3 style={{ marginTop: "40px" }}>Summary</h3>
            <p className="book-summary">{book.summary}</p>
          </>
        )}
      </div>
    </div>
  );
}
