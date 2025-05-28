"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthModal } from "@/context/AuthModalContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@firebase/firebaseClient";
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

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const { openModal } = useAuthModal();

  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState("basic");
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [isInLibrary, setIsInLibrary] = useState(false);

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
    const checkLibrary = async () => {
      if (user && book) {
        const docRef = doc(db, "users", user.uid, "library", book.id);
        const docSnap = await getDoc(docRef);
        setIsInLibrary(docSnap.exists());
      }
    };

    checkLibrary();
  }, [user, book]);

  const handleAction = (type: "read" | "listen") => {
    if (!user) return openModal();
    if (checkingAccess) return;

    const normalizedPlan = plan.toLowerCase();
    const hasAccess = ["premium", "premium-annual"].includes(normalizedPlan);

    if (book?.subscriptionRequired && !hasAccess) {
      router.push("/choose-plan");
    } else {
      router.push(`/player/${book?.id}`);
    }
  };

  const handleAddToLibrary = async () => {
    if (!user) {
      openModal();
      return;
    }

    if (!book) return;

    try {
      const docRef = doc(db, "users", user.uid, "library", book.id);
      await setDoc(docRef, {
        id: book.id,
        title: book.title,
        author: book.author,
        subTitle: book.subTitle,
        imageLink: book.imageLink,
        summary: book.summary,
        subscriptionRequired: book.subscriptionRequired,
        addedAt: new Date().toISOString(),
      });
      setIsInLibrary(true);
    } catch (error) {
      console.error("Error adding book to library:", error);
      alert("Failed to add book to library.");
    }
  };

  const handleRemoveFromLibrary = async () => {
    if (!user || !book) return;

    try {
      const docRef = doc(db, "users", user.uid, "library", book.id);
      await deleteDoc(docRef);
      setIsInLibrary(false);
    } catch (err) {
      console.error("Failed to remove book:", err);
      alert("Could not remove book.");
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>

      <div className="content-container">
        <div className="book-detail-container">
          <div className="book-detail-header">
            <img
              src={book.imageLink}
              alt={book.title}
              className="book-detail-img"
            />
            <div className="book-detail-info">
              <h1>
                {book.title}{" "}
                {book.subscriptionRequired && (
                  <span className="book-premium-pill">Premium</span>
                )}
              </h1>
              <h3>{book.subTitle}</h3>
              <p>by {book.author}</p>

              <div className="book-stats">
                <p>
                  {book.averageRating} ({book.totalRating} ratings)
                </p>
                <p>{book.type}</p>
                <p>{book.keyIdeas} Key Ideas</p>
              </div>

              <div className="book-tags">
                {book.tags.map((tag) => (
                  <span key={tag} className="book-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="book-detail-buttons">
                <button
                  className="read-button"
                  onClick={() => handleAction("read")}
                >
                  Read
                </button>
                <button
                  className="listen-button"
                  onClick={() => handleAction("listen")}
                >
                  Listen
                </button>
                <button
                  className="library-button"
                  onClick={
                    isInLibrary ? handleRemoveFromLibrary : handleAddToLibrary
                  }
                >
                  {isInLibrary ? "Remove from My Library" : "Add to My Library"}
                </button>
              </div>
            </div>
          </div>

          <div className="book-detail-body">
            <h3>What's it about?</h3>
            <p>{book.bookDescription}</p>

            <h3>About the author</h3>
            <p>{book.authorDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
