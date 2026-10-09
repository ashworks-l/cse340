
import "dotenv/config";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import { testConnection } from "./src/models/db.js";
import router from "./src/routes.js";
import flash from "./src/middleware/flash.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not configured.");
}

// Recognize the HTTPS connection through Render's proxy.
if (NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Parse form submissions
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(
    session({
        name: "cse340.sid",
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "lax"
        }
    })
);

// Make session information available to templates
app.use((req, res, next) => {
    res.locals.isLoggedIn = Boolean(
        req.session && req.session.user
    );

    res.locals.user = req.session?.user || null;
    res.locals.NODE_ENV = NODE_ENV;

    next();
});

// Flash messages
app.use(flash);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Request logging in development
app.use((req, res, next) => {
    if (NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`);
    }

    next();
});

// Application routes
app.use(router);

// 404 handler
app.use((req, res, next) => {
    const error = new Error("Page Not Found");
    error.status = 404;

    next(error);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error occurred:", err.message);
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || 500;
    const template = status === 404 ? "404" : "500";

    return res.status(status).render(`errors/${template}`, {
        title: status === 404 ? "Page Not Found" : "Server Error",
        error: err.message,
        stack:
            NODE_ENV === "development"
                ? err.stack
                : undefined
    });
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);

    try {
        await testConnection();
        console.log("Database connection successful.");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});
