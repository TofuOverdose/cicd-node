const Koa = require('Koa');

async function start() {
    const config = require('../../infra/config');

    const container = require('../../infra/service-container');

    const orderRouter = require('./routes/orders')({orderRepository: container.database});
    const menuRouter = require('./routes/menu')({menuRepository: container.database});

    const server = new Koa();

    server.use(orderRouter.routes());
    server.use(orderRouter.allowedMethods());
    server.use(menuRouter.routes());
    server.use(menuRouter.allowedMethods());

    const port = config('APP_PORT');
    server.listen(port, () => {
        console.log('Started server on port', port);
    });
}

module.exports = {
    start,
};
