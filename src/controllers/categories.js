import { body, validationResult } from 'express-validator';

import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';


const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();

    const title = 'Service Categories';

    res.render('categories', {
        title,
        categories
    });
};


const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    const projects = await getProjectsByCategoryId(categoryId);

    const title = 'Category Details';

    res.render('category', {
        title,
        category,
        projects
    });
};


const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);

    const categories = await getAllCategories();

    const assignedCategories =
        await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
        title,
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};


const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await updateCategoryAssignments(
        projectId,
        categoryIdsArray
    );

    req.flash(
        'success',
        'Categories updated successfully.'
    );

    res.redirect(`/project/${projectId}`);
};


/* =========================
   CREATE CATEGORY
========================= */

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ max: 100 })
        .withMessage(
            'Category name must be 100 characters or less'
        )
        .isLength({ min: 3 })
        .withMessage(
            'Category name must be at least 3 characters'
        )
];


const showNewCategoryForm = (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', {
        title
    });
};


const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    const { name } = req.body;

    try {
        const categoryId = await createCategory(name);

        req.flash(
            'success',
            'Category created successfully!'
        );

        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error(
            'Error creating category:',
            error
        );

        req.flash(
            'error',
            'There was an error creating the category.'
        );

        res.redirect('/new-category');
    }
};


/* =========================
   EDIT CATEGORY
========================= */

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    const title = 'Edit Category';

    res.render('edit-category', {
        title,
        category
    });
};


const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(
            `/edit-category/${categoryId}`
        );
    }

    const { name } = req.body;

    try {
        await updateCategory(categoryId, name);

        req.flash(
            'success',
            'Category updated successfully!'
        );

        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error(
            'Error updating category:',
            error
        );

        req.flash(
            'error',
            'There was an error updating the category.'
        );

        res.redirect(
            `/edit-category/${categoryId}`
        );
    }
};


export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};