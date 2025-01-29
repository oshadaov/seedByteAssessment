import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Books API",
            version: "1.0.0",
            description: "A simple Books API using Node.js and Express",
        },
        servers: [{ url: "http://localhost:3000" }],
    },
    apis: [__dirname + "/../routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};

export default setupSwagger;
