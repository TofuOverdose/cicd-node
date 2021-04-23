const bootstrap = require('./src/infra/bootstrap');

(async function main() {
    await bootstrap();

    if (process.argv.findIndex(x => x === '--repl') > 0) {
        console.log('Loading REPL server');
        const replServer = require('./src/interfaces/menu-repl/server');
        replServer.start();
    } else {
        console.log('Loading HTTP server');
        const httpServer = require('./src/interfaces/http/server');
        httpServer.start();
    }
})();
