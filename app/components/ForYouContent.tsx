"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function ForYouContent() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const selected = await fetch(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
      ).then((res) => res.json());

      setSelectedBook(selected[0]);

      const recommended = await fetch(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
      ).then((res) => res.json());
      const suggested = await fetch(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
      ).then((res) => res.json());

      setRecommendedBooks(recommended);
      setSuggestedBooks(suggested);
    };

    fetchBooks();
  }, []);

  const renderBookCard = (book: Book) => (
    <Link
      href={`/book/${book.id}`}
      key={book.id}
      className="book-card"
      style={{ textDecoration: "none" }}
    >
      <img src={book.imageLink} alt={book.title} className="book-img" />
      <h4>{book.title}</h4>
      <p>{book.author}</p>
      {book.subscriptionRequired && <span className="pill">Premium</span>}
    </Link>
  );

  return (
    <div>
      <h3>Selected just for you</h3>
      {selectedBook ? (
        <Link
          href={`/book/${selectedBook.id}`}
          className="selected-book-card"
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
            textDecoration: "none",
          }}
        >
          <img
            src={selectedBook.imageLink}
            alt={selectedBook.title}
            className="selected-book-img"
            style={{ width: "180px", borderRadius: "8px" }}
          />
          <div className="selected-book-details">
            <h2>{selectedBook.title}</h2>
            <h4>{selectedBook.subTitle}</h4>
            <p>{selectedBook.author}</p>
            {selectedBook.subscriptionRequired}
          </div>
        </Link>
      ) : (
        <p>No selected book found.</p>
      )}

      <h3>Recommended For You</h3>
      <div className="book-section">{recommendedBooks.map(renderBookCard)}</div>

      <h3>Suggested Books</h3>
      <div className="book-section">{suggestedBooks.map(renderBookCard)}</div>
    </div>
  );
}
