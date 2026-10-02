import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getCategoryById = async (categoryId) => {
    const query = `
        SELECT
            category_id,
            name
        FROM public.category
        WHERE category_id = $1;
    `;

    const queryParams = [categoryId];

    const result = await db.query(query, queryParams);

    return result.rows.length > 0
        ? result.rows[0]
        : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM public.category AS c
        JOIN public.service_project_category AS spc
            ON c.category_id = spc.category_id
        WHERE spc.project_id = $1
        ORDER BY c.name;
    `;

    const queryParams = [projectId];

    const result = await db.query(query, queryParams);

    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date,
            sp.organization_id,
            o.name AS organization_name
        FROM public.service_project AS sp
        JOIN public.service_project_category AS spc
            ON sp.project_id = spc.project_id
        JOIN public.organization AS o
            ON sp.organization_id = o.organization_id
        WHERE spc.category_id = $1
        ORDER BY sp.date;
    `;

    const queryParams = [categoryId];

    const result = await db.query(query, queryParams);

    return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO public.service_project_category
            (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (
    projectId,
    categoryIds
) => {
    // Remove existing category assignments
    const deleteQuery = `
        DELETE FROM public.service_project_category
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    // Add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(
            categoryId,
            projectId
        );
    }
};

const createCategory = async (name) => {
    const query = `
        INSERT INTO public.category
            (name)
        VALUES
            ($1)
        RETURNING category_id;
    `;

    const queryParams = [name];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE public.category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const queryParams = [
        name,
        categoryId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update category');
    }

    return result.rows[0].category_id;
};

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};