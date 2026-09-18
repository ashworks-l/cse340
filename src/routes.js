import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './controllers/organizations.js';

import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);

router.get('/service-projects', showProjectsPage);

router.get('/categories', showCategoriesPage);

// Error-handling route
router.get('/test-error', testErrorPage);

// Organization details route
router.get('/organization/:id', showOrganizationDetailsPage);

export default router;