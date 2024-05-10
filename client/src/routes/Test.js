import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Test() {
  const [books, setBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);

  // Function to fetch trending books based on view count
  const fetchTrendingBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/books/top5');
      setTrendingBooks(response.data.data);
    } catch (error) {
      console.error('Error fetching trending books:', error);
    }
  };

  // Fetch all books when component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch trending books when the component mounts or when the list of books updates
  useEffect(() => {
    fetchTrendingBooks();
  }, [books]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/books');
      setBooks(response.data.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleReadClick = async (bookId) => {
    try {
      await axios.put(`http://localhost:8080/books/${bookId}`, { $inc: { view: 1 } });
      // After updating the view count, fetch the updated list of books
      fetchBooks();
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  return (
    <div className="book-reader">
      <h2>List of Books</h2>
      <div className="book-list">
        {books.map((book) => (
          <div key={book._id} className="book">
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Description: {book.description}</p>
            <img src={book.image} alt="Book Cover" />
            <button onClick={() => handleReadClick(book._id)}>Read</button>
            <p>Views: {book.view}</p>
          </div>
        ))}
      </div>
      <div className="trending-books">
        <h2>Trending Books</h2>
        <div className="book-list">
          {trendingBooks.map((book) => (
            <div key={book._id} className="book">
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Genre: {book.genre}</p>
              <p>Description: {book.description}</p>
              <img src={book.image} alt="Book Cover" />
              <p>Views: {book.view}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
