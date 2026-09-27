/**
 * Flash Message Middleware
 *
 * Provides temporary message storage that survives redirects
 * but is consumed on render.
 */

const flashMiddleware = (req, res, next) => {
    req.flash = function(type, message) {

        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        // Store a message
        if (type && message) {
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }

            req.session.flash[type].push(message);
            return;
        }

        // Get one type
        if (type && !message) {
            const messages = req.session.flash[type] || [];

            req.session.flash[type] = [];

            return messages;
        }

        // Get all messages
        const allMessages = req.session.flash;

        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return allMessages;
    };

    next();
};

const flashLocals = (req, res, next) => {
    res.locals.flash = req.flash;
    next();
};

const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;