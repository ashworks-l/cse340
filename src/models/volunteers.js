
import db from './db.js';

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteer
            (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING;
    `;

    await db.query(query, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1
          AND project_id = $2;
    `;

    await db.query(query, [userId, projectId]);
};

const getProjectsByVolunteerId = async (userId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date,
            o.name AS organization_name
        FROM project_volunteer AS pv
        JOIN service_project AS sp
            ON pv.project_id = sp.project_id
        JOIN organization AS o
            ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.date;
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
};

const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM project_volunteer
        WHERE user_id = $1
          AND project_id = $2
        LIMIT 1;
    `;

    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

export {
    addVolunteer,
    removeVolunteer,
    getProjectsByVolunteerId,
    isUserVolunteering
};
