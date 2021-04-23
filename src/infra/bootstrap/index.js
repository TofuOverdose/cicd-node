const config = require('../config');

module.exports = async function() {
    console.log('- - - Loading environment variables - - -');
    require('dotenv').config();

    const appEnv = config('APP_ENV', 'prod');
    console.log('- - - Initializing as', appEnv, '- - - ');

    console.log('- - - Initializing service container - - - ');
    require('../service-container');
};
