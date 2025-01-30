import request from "supertest";
import app from "../server.js";

describe("Books API", () => {
    beforeEach(() => {
        // Reset books array before each test to avoid test pollution
        global.books = [];
    });

    test("GET /books should return an empty array initially", async () => {
        const response = await request(app).get("/books");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("POST /books should add a book", async () => {
        const newBook = { name: "Test Book", author: "Test Author", publishedYear: 2023 };
        const response = await request(app).post("/books").send(newBook);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("name", "Test Book");
        expect(response.body).toHaveProperty("author", "Test Author");
        expect(response.body).toHaveProperty("publishedYear", 2023);
    });

    test("POST /books should reject invalid input", async () => {
        const invalidBook = { name: "", author: "Test Author", publishedYear: "wrong year" };
        const response = await request(app).post("/books").send(invalidBook);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid input");
    });
});
export {};