import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import booksRoutes from "./routes/booksRoutes.js";
import setupSwagger from "./docs/swagger.js"; // Import Swagger setup
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// Setup Swagger
setupSwagger(app);

// Use API routes
app.use("/books", booksRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}\nAPI Docs: http://localhost:${PORT}/api-docs`));



export default app;