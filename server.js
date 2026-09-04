import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.render("index", {
        title: "Home"
    });
});

// Organizations page
app.get("/organizations", (req, res) => {
    res.render("organizations", {
        title: "Organizations"
    });
});

// Service Projects page
app.get("/service-projects", (req, res) => {
    res.render("service-projects", {
        title: "Service Projects"
    });
});

// Categories page
app.get("/categories", (req, res) => {
    res.render("categories", {
        title: "Categories"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});