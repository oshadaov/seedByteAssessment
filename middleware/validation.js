import { body, validationResult } from "express-validator";

export const validateBook = [
    body("name").trim().escape().notEmpty().withMessage("Name is required"),
    body("author").trim().escape().notEmpty().withMessage("Author is required"),
    body("publishedYear").isInt({ min: 1000, max: 9999 }).withMessage("Valid year required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];
