// controllers/booksController.js
import books from "../models/bookModel.js";

export const getBooks = (req, res) => {
    res.json(books);
};

export const getBookById = (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
};

export const addBook = (req, res) => {
    const { name, author, publishedYear } = req.body;
    const newBook = { id: books.length + 1, name, author, publishedYear };
    books.push(newBook);
    res.status(201).json(newBook);
};

export const updateBook = (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ error: "Book not found" });

    const { name, author, publishedYear } = req.body;
    book.name = name;
    book.author = author;
    book.publishedYear = publishedYear;
    res.json(book);
};

export const deleteBook = (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).json({ error: "Book not found" });
    books.splice(bookIndex, 1);
    res.json({ message: "Book deleted successfully" });
};