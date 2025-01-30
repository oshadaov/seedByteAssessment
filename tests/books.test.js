import request from "supertest";
import app from "../server.js";
import books from "../models/bookModel.js"; // Import in-memory data store

describe("Books API", () => {
    beforeEach(() => {
        // Reset books array before each test
        books.length = 0;
    });

    test("GET /books should return an empty array initially", async () => {
        const response = await request(app).get("/books");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            totalBooks: 0,
            totalPages: 0,
            currentPage: 1,
            books: []
        });
    });

    test("POST /books should add a book", async () => {
        const newBook = { name: "Test Book", author: "Test Author", publishedYear: 2023 };
        const response = await request(app).post("/books").send(newBook);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id", 1);
        expect(response.body).toHaveProperty("name", "Test Book");
        expect(response.body).toHaveProperty("author", "Test Author");
        expect(response.body).toHaveProperty("publishedYear", 2023);
    });

    test("POST /books should reject invalid input", async () => {
        const invalidBook = { name: "", author: "Test Author", publishedYear: "wrong year" };
        const response = await request(app).post("/books").send(invalidBook);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(Array.isArray(response.body.errors)).toBe(true);
        expect(response.body.errors[0]).toHaveProperty("msg", "Name is required");
        expect(response.body.errors[1]).toHaveProperty("msg", "Valid year required");
    });

    test("GET /books/:id should return a specific book", async () => {
        const newBook = { name: "Book One", author: "Author One", publishedYear: 2020 };
        const postResponse = await request(app).post("/books").send(newBook);

        const bookId = postResponse.body.id;
        const response = await request(app).get(`/books/${bookId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", bookId);
        expect(response.body).toHaveProperty("name", "Book One");
    });

    test("GET /books/:id should return 404 if book not found", async () => {
        const response = await request(app).get("/books/999");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "Book not found");
    });

    test("PUT /books/:id should update a book", async () => {
        const newBook = { name: "Old Title", author: "Old Author", publishedYear: 2010 };
        const postResponse = await request(app).post("/books").send(newBook);
        
        const updatedBook = { name: "Updated Title", author: "Updated Author", publishedYear: 2022 };
        const bookId = postResponse.body.id;
        const response = await request(app).put(`/books/${bookId}`).send(updatedBook);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("name", "Updated Title");
        expect(response.body).toHaveProperty("author", "Updated Author");
        expect(response.body).toHaveProperty("publishedYear", 2022);
    });

    test("PUT /books/:id should return 404 if book not found", async () => {
        const updatedBook = { name: "New Title", author: "New Author", publishedYear: 2022 };
        const response = await request(app).put("/books/999").send(updatedBook);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "Book not found");
    });

    test("DELETE /books/:id should delete a book", async () => {
        const newBook = { name: "Book to Delete", author: "Author", publishedYear: 2015 };
        const postResponse = await request(app).post("/books").send(newBook);

        const bookId = postResponse.body.id;
        const response = await request(app).delete(`/books/${bookId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Book deleted successfully");

        // Verify the book is actually deleted
        const getResponse = await request(app).get(`/books/${bookId}`);
        expect(getResponse.status).toBe(404);
    });

    test("DELETE /books/:id should return 404 if book not found", async () => {
        const response = await request(app).delete("/books/999");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "Book not found");
    });
    test("GET /books should return paginated results", async () => {
        // Add 7 books to test pagination
        for (let i = 1; i <= 7; i++) {
            await request(app).post("/books").send({
                name: `Book ${i}`,
                author: `Author ${i}`,
                publishedYear: 2000 + i
            });
        }
    
        // Request first page with 3 books per page
        const response = await request(app).get("/books?page=1&limit=3");
    
        expect(response.status).toBe(200);
        expect(response.body.books.length).toBe(3);
        expect(response.body).toHaveProperty("totalBooks", 7);
        expect(response.body).toHaveProperty("totalPages", 3);
        expect(response.body).toHaveProperty("currentPage", 1);
    });
    
});

export {}; // Ensure Jest treats this file as an ES module
