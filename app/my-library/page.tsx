"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@firebase/firebaseClient";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

interface Book {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  summary: string;
  subscriptionRequired: boolean;
}

export default function MyLibrary() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const booksRef = collection(db, "users", firebaseUser.uid, "library");
        const snapshot = await getDocs(booksRef);
        const books = snapshot.docs.map((doc) => doc.data() as Book);
        setLibraryBooks(books);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>
      <SearchBar isSidebarOpen={isSidebarOpen} />
      <div className="content-container">
        <h2>My Library</h2>

        {loading ? (
          <p>Loading...</p>
        ) : !user ? (
          <p>Please sign in to view your library.</p>
        ) : libraryBooks.length === 0 ? (
          <p>Your library is empty.</p>
        ) : (
          <div className="book-section">
            {libraryBooks.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="book-card"
              >
                <img
                  src={book.imageLink}
                  alt={book.title}
                  className="book-img"
                />
                <h4>{book.title}</h4>
                <p>{book.author}</p>
                {book.subscriptionRequired && (
                  <span className="pill">Premium</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
