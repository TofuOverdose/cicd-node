const koaBody = require('koa-body');
const Router = require('@koa/router');
const {OrderController} = require('../controllers');

module.exports = function({orderRepository}) {
    const orderController = new OrderController({orderRepository});
    const router = new Router({
        prefix: '/orders',
    });

    router.use(koaBody());

    router.get('/:orderId', async({params, request, response}) => await orderController.getOrderById(params.orderId, {request, response}));
    router.get('/', async({request, response}) => await orderController.getOrdersByClientEmail({request, response}));
    router.post('/', async({request, response}) => await orderController.createOrder({request, response}));

    return router;
};
