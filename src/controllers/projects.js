import { body, validationResult } from 'express-validator';

import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';

import {
    getAllOrganizations
} from '../models/organizations.js';

import {
    addVolunteer,
    removeVolunteer,
    isUserVolunteering
} from '../models/volunteers.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Show all upcoming projects
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(
        NUMBER_OF_UPCOMING_PROJECTS
    );

    const title = 'Upcoming Service Projects';

    res.render('service-projects', {
        title,
        projects
    });
};

// Show project details
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    const categories = await getCategoriesByProjectId(projectId);

    const title = 'Service Project Details';

    res.render('project', {
        title,
        project,
        categories
    });
};

// Validation rules for new service projects
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage(
            'Title must be between 3 and 200 characters'
        ),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage(
            'Description must be less than 1000 characters'
        ),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage(
            'Location must be less than 200 characters'
        ),

    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage(
            'Date must be a valid date format'
        ),

    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage(
            'Organization must be a valid integer'
        )
];

// Show the new project form
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();

    const title = 'Add New Service Project';

    res.render('new-project', {
        title,
        organizations
    });
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    const title = 'Edit Service Project';

    res.render('edit-project', {
        title,
        project,
        organizations
    });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body;

    try {
        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash(
            'success',
            'Service project updated successfully!'
        );

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error(
            'Error updating service project:',
            error
        );

        req.flash(
            'error',
            'There was an error updating the service project.'
        );

        res.redirect(`/edit-project/${projectId}`);
    }
};

// Process the new project form
const processNewProjectForm = async (req, res) => {

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    // Extract form data
    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body;

    try {

        // Create the new project
        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash(
            'success',
            'New service project created successfully!'
        );

        res.redirect(`/project/${newProjectId}`);

    } catch (error) {

        console.error(
            'Error creating new project:',
            error
        );

        req.flash(
            'error',
            'There was an error creating the service project.'
        );

        res.redirect('/new-project');
    }
};

const volunteerForProject = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.id;

    try {
        await addVolunteer(userId, projectId);

        req.flash(
            'success',
            'You are now volunteering for this project.'
        );

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error volunteering for project:', error);

        req.flash(
            'error',
            'Unable to sign up for this project.'
        );

        res.redirect(`/project/${projectId}`);
    }
};

const removeVolunteerFromProject = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.id;

    try {
        await removeVolunteer(userId, projectId);

        req.flash(
            'success',
            'You are no longer volunteering for this project.'
        );

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error removing volunteer:', error);

        req.flash(
            'error',
            'Unable to remove your volunteer signup.'
        );

        res.redirect(`/project/${projectId}`);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    volunteerForProject,
    removeVolunteerFromProject  
};