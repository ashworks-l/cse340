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
    processEditProjectForm
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

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);

// Add organization
router.get('/new-organizations', (req, res) => {
    res.render('new-organization', {
        title: 'Add Organization'
    });
});

router.post(
    '/new-organizations',
    organizationValidation,
    processNewOrganizationForm
);

// Edit organization
router.get(
    '/edit-organization/:id',
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

router.get('/service-projects', showProjectsPage);

// New service project form
router.get('/new-project', showNewProjectForm);

// Process new service project form
router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

router.get('/service-projects/:id', showProjectDetailsPage);

router.get(
    '/edit-project/:id',
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    processEditProjectForm
);

router.get('/categories', showCategoriesPage);

router.get(
    '/assign-categories/:projectId',
    showAssignCategoriesForm
);

router.post(
    '/assign-categories/:projectId',
    processAssignCategoriesForm
);

router.get('/category/:id', showCategoryDetailsPage);

// Error-handling route
router.get('/test-error', testErrorPage);

// Organization details route
router.get('/organization/:id', showOrganizationDetailsPage);

// Service project details route
router.get('/project/:id', showProjectDetailsPage);

router.get(
    '/new-category',
    showNewCategoryForm
);

router.post(
    '/new-category',
    categoryValidation,
    processNewCategoryForm
);

router.get(
    '/edit-category/:id',
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    categoryValidation,
    processEditCategoryForm
);

export default router;