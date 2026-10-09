import bcrypt from 'bcrypt';
import db from './db.js';

// Create a new user with the default "user" role
const createUser = async (name, email, passwordHash) => {
    const defaultRole = 'user';

    const query = `
        INSERT INTO users
            (name, email, password_hash, role_id)
        VALUES
            (
                $1,
                $2,
                $3,
                (
                    SELECT role_id
                    FROM roles
                    WHERE role_name = $4
                )
            )
        RETURNING user_id;
    `;

    const queryParams = [
        name,
        email,
        passwordHash,
        defaultRole
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(
            'Created new user with ID:',
            result.rows[0].user_id
        );
    }

    return result.rows[0].user_id;
};

// Find one user by email, including their role
const findUserByEmail = async (email) => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            r.role_name
        FROM users AS u
        JOIN roles AS r
            ON u.role_id = r.role_id
        WHERE u.email = $1;
    `;

    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

// Get all registered users and their roles
const getAllUsers = async () => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            r.role_name
        FROM users AS u
        JOIN roles AS r
            ON u.role_id = r.role_id
        ORDER BY u.name ASC;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Verify the user's password
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// Authenticate a user
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordMatches = await verifyPassword(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        return null;
    }

    // Never store the password hash in the session user object
    delete user.password_hash;

    return user;
};

export {
    createUser,
    findUserByEmail,
    getAllUsers,
    authenticateUser
};
