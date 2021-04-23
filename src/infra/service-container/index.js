const config = require('../config');

function init() {
    const container = {
        database: null,
        // These aren't implemented yet but desired
        logger: null,
        eventQueue: null,
    };

    const appEnv = config('APP_ENV', 'prod').toLowerCase();
    if (appEnv === 'prod') {
        container.database = require('../database/mysql');
    } else {
        container.database = require('../database/memory');
    }

    return container;
}

const container = init();

module.exports = container;
