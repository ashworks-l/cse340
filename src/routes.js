import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showEditOrganizationForm,
    processNewOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    volunteerForProject,
    removeVolunteerFromProject
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
} from './controllers/users.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home
router.get('/', showHomePage);

// Registration
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// Login and logout
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// User dashboard
router.get('/dashboard', requireLogin, showDashboard);

router.get(
    '/users',
    requireLogin,
    requireRole('admin'),
    showUsersPage
);
// Organizations
router.get('/organizations', showOrganizationsPage);

// Create organization
router.get(
    '/new-organization',
    requireLogin,
    requireRole('admin'),
    (req, res) => {
        res.render('new-organization', {
            title: 'Add Organization'
        });
    }
);
router.post(
    '/new-organization',
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

// Edit organization
router.get(
    '/edit-organization/:id',
    requireRole('admin'),
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

// Service projects
router.get('/service-projects', showProjectsPage);

// Create service project
router.get(
    '/new-project',
    requireRole('admin'),
    showNewProjectForm
);

router.post(
    '/new-project',
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

// Service project details
router.get(
    '/service-projects/:id',
    showProjectDetailsPage
);

router.get(
    '/project/:id',
    showProjectDetailsPage
);

// Edit service project
router.get(
    '/edit-project/:id',
    requireRole('admin'),
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    requireRole('admin'),
    processEditProjectForm
);

// Categories
router.get('/categories', showCategoriesPage);

// Category details
router.get(
    '/category/:id',
    showCategoryDetailsPage
);

// Create category
router.get(
    '/new-category',
    requireRole('admin'),
    showNewCategoryForm
);

router.post(
    '/new-category',
    requireRole('admin'),
    categoryValidation,
    processNewCategoryForm
);

// Edit category
router.get(
    '/edit-category/:id',
    requireRole('admin'),
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    requireRole('admin'),
    categoryValidation,
    processEditCategoryForm
);

// Assign categories to a project
router.get(
    '/assign-categories/:projectId',
    requireRole('admin'),
    showAssignCategoriesForm
);

router.post(
    '/assign-categories/:projectId',
    requireRole('admin'),
    processAssignCategoriesForm
);

// Organization details
router.get(
    '/organization/:id',
    showOrganizationDetailsPage
);

// Error testing
router.get('/test-error', testErrorPage);

router.get(
    '/project/:id/volunteer',
    requireLogin,
    volunteerForProject
);

router.get(
    '/project/:id/remove-volunteer',
    requireLogin,
    removeVolunteerFromProject
);

export default router;