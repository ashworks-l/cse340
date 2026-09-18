import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);

router.get('/service-projects', showProjectsPage);

router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryDetailsPage);

// Error-handling route
router.get('/test-error', testErrorPage);

// Organization details route
router.get('/organization/:id', showOrganizationDetailsPage);

// Service project details route
router.get('/project/:id', showProjectDetailsPage);

export default router;