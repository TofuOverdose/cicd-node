const Router = require('@koa/router');
const {MenuController} = require('../controllers');

module.exports = function({menuRepository}) {
    const menuController = new MenuController({menuRepository});
    const router = new Router();

    router.get('/menu', async({request, response}) => await menuController.listMenu({request, response}));

    return router;
};
