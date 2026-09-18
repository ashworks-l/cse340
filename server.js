import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { testConnection } from "./src/models/db.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";
import { getAllCategories } from "./src/models/categories.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Home page
app.get("/", (req, res) => {
    res.render("index", {
        title: "Home"
    });
});

// Organizations page
app.get("/organizations", async (req, res) => {

    const organizations = await getAllOrganizations();

    console.log(organizations);

    const title = "Our Partner Organizations";

    res.render("organizations", {
        title,
        organizations
    });

});

// Service Projects page
app.get("/service-projects", async (req, res) => {
    const projects = await getAllProjects();

    console.log(projects);

    res.render("service-projects", {
        title: "Service Projects",
        projects
    });
});

// Categories page
app.get("/categories", async (req, res) => {
    const categories = await getAllCategories();

    console.log(categories);

    res.render("categories", {
        title: "Categories",
        categories
    });
});

// Start server
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});