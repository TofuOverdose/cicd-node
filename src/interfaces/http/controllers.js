const ModelValidationError = require('../../application/errors/ModelValidationError');
const NotFoundError = require('../../application/errors/NotFoundError');
const EmptyMenuError = require('../../application/errors/EmptyMenuError');

class OrderController {
    constructor({orderRepository}) {
        this.useCases = {
            getOrderById: require('./../../application/use-cases/GetOrderById')(orderRepository),
            createOrder: require('./../../application/use-cases/CreateOrder')(orderRepository),
        };
    }

    async createOrder({request, response}) {
        const missingFields = [];
        const {clientEmail, menuItemId, quantity} = request.body;
        if (clientEmail === undefined) {
            missingFields.push('clientEmail');
        }
        if (menuItemId === undefined) {
            missingFields.push('menuItemId');
        }
        if (quantity === undefined) {
            missingFields.push('quantity');
        }
        if (missingFields.length > 0) {
            response.code = 400;
            response.body = {
                error: {
                    code: 'ORDER_MISSING_FIELDS',
                    message: 'Required fields were not found in request body',
                    fields: missingFields,
                },
            };
            return;
        }

        try {
            const order = await this.useCases.createOrder(clientEmail, menuItemId, quantity);
            response.code = 201;
            response.body = order.toJSON();
        } catch (e) {
            if (e instanceof ModelValidationError) {
                response.code = 400;
                response.body = {
                    error: {
                        code: 'ORDER_VALIDATION_ERROR',
                        message: 'Validation error for Order',
                        fields: e.errors,
                    },
                };
                return;
            }

            throw e;
        }
    }

    async getOrderById(orderId, {response}) {
        try {
            const order = await this.useCases.getOrderById(orderId);
            response.body = order.toJSON();
        } catch (e) {
            if (e instanceof NotFoundError) {
                response.code = 404;
                response.body = {
                    error: {
                        code: 'ORDER_NOT_FOUND',
                        message: 'Order not found',
                    },
                };
                return;
            }

            throw e;
        }
    }

    async getOrdersByClientEmail({request, response}) {
        const clientEmail = request.query['client-email'];
        if (!clientEmail) {
            response.code = 400;
            response.body = {
                error: {
                    code: 'ORDER_REQUIRED_EMAIL',
                    message: 'client-email query parameter is required',
                },
            };
        }
        response.body = 'Sorry, not implemeted';
    }
}

class MenuController {
    constructor({menuRepository}) {
        this.repository = menuRepository;
        this.useCases = {
            getMenuItems: require('./../../application/use-cases/GetMenu')(this.repository),
        };
    }

    async listMenu({response}) {
        try {
            const menuItems = await this.useCases.getMenuItems();
            response.body = {
                menuItems: menuItems.map(x => x.toJSON()),
            };
        } catch (e) {
            if (e instanceof EmptyMenuError) {
                response.code = 404;
                response.body = {
                    error: {
                        code: 'MENU_EMPTY',
                        message: 'Menu is empty',
                    },
                };
                return;
            }

            throw e;
        }
    }
}

module.exports = {
    OrderController,
    MenuController,
};
