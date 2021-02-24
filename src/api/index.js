const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('@koa/router');
const db = require('../storage/database');
const coffee = require('../domain/coffee');

const router = new Router();

router.get('/menu', async({request, response}) => {
    try {
        const menu = await db.getMenuItems();
        response.body = menu;
    } catch (e) {
        console.error('Failed to get the menu', e);
        response.status = 500;
    }
});

router.post('/orders', async({request, response}) => {
    try {
        const menuItem = await db.getMenuItemByName(request.body.item);
        if (!menuItem) {
            response.status = 400;
            response.body = {
                message: 'Wrong input',
                errors: {
                    item: 'invalid value',
                },
            };
            return;
        }

        const order = await db.createOrder({
            clientEmail: request.body.email,
            itemId: menuItem.id,
            quantity: request.body.quantity,
        });

        response.status = 201;
        response.body = order;
    } catch (e) {
        console.error('Failed to create an order', e);
        response.status = 500;
    }
});

router.get('/orders/:orderId', async({params, request, response}) => {
    try {
        const order = await db.getOrderById(params.orderId);
        if (!order) {
            response.status = 404;
            return;
        }

        response.body = order;
    } catch (e) {
        console.error('Failed to get an order data', e);
        response.status = 500;
    }
});

router.get('/orders', async({request, response}) => {
    try {
        const orders = await db.getOrdersByClientEmail(request.query.email);
        if (!orders.length) {
            response.status = 404;
            return;
        }

        response.body = orders;
    } catch (e) {
        console.error('Failed to get orders list', e);
        response.status = 500;
    }
});

router.get('/credits', async({request, response}) => {
    try {
        const creditPoints = await coffee.getCreditsByEmail(request.query.email);
        response.body = {
            email: request.query.email,
            credits: creditPoints,
        };
    } catch (e) {
        console.error('Failed to calculate the credits', e);
        response.status = 500;
    }
});

router.get('/ping', async({response}) => {
    response.code = 204;
    response.body = 'pong';
});

const app = new Koa();
app.use(koaBody());

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
