"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@firebase/firebaseClient";
import { useAuthModal } from "@/context/AuthModalContext";
import Sidebar from "@/components/Sidebar";

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
  const { openModal } = useAuthModal();

  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        openModal();
        return;
      }

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
      setIsSubscribed(data?.isActive === true);
    });

    return () => unsubscribe();
  }, [openModal]);

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
    if (book && user) {
      if (book.subscriptionRequired && !isSubscribed) {
        router.push("/choose-plan");
      }
    }
  }, [book, isSubscribed, router, user]);

  if (!book) return <p>Loading book...</p>;

  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
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
