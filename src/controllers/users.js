
import bcrypt from 'bcrypt';

import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';

import {
     getProjectsByVolunteerId 
} from '../models/volunteers.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash(
            'success',
            'Registration successful! Please log in.'
        );

        return res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);

        req.flash(
            'error',
            'An error occurred during registration. Please try again.'
        );

        return res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            role_name: user.role_name
        };

        req.session.save((error) => {
            if (error) {
                console.error('Error saving session:', error);

                req.flash(
                    'error',
                    'Unable to complete login. Please try again.'
                );

                return res.redirect('/login');
            }

            req.flash('success', 'Login successful!');

            if (user.role_name === 'admin') {
                return res.redirect('/users');
            }

            return res.redirect('/dashboard');
        });
    } catch (error) {
        console.error('Error during login:', error);

        req.flash(
            'error',
            'An error occurred during login. Please try again.'
        );

        return res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Error destroying session:', error);
            return res.redirect('/dashboard');
        }

        return res.redirect('/login');
    });
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash(
            'error',
            'You must be logged in to access that page.'
        );

        return res.redirect('/login');
    }

    return next();
};


const showDashboard = async (req, res) => {
    try {
        const user = req.session.user;

        const volunteerProjects = await getProjectsByVolunteerId(
            user.user_id
        );

        return res.render('dashboard', {
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            role_name: user.role_name,
            volunteerProjects
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        return res.status(500).render('500', {
            title: 'Server Error'
        });
    }
};


const showUsersPage = async (req, res) => {
    try {
        const users = await getAllUsers();

        return res.render('users', {
            title: 'Registered Users',
            users
        });
    } catch (error) {
        console.error('Error loading users:', error);

        req.flash(
            'error',
            'Unable to load registered users.'
        );

        return res.redirect('/dashboard');
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash(
                'error',
                'You must be logged in to access this page.'
            );

            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash(
                'error',
                'You do not have permission to access this page.'
            );

            return res.redirect('/dashboard');
        }

        return next();
    };
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
};
