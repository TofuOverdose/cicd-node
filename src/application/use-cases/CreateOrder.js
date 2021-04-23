const {Order, ClientEmail} = require('../../domain/models');
const ModelValidationError = require('../errors/ModelValidationError');

function validateOrder(order) {
    const {valid, errors} = order.validate();
    if (valid === false) {
        throw new ModelValidationError(
            order.constructor.name,
            errors.reduce((acc, cur) => {
                return {
                    ...acc,
                    [cur.path[0]]: cur.message,
                };
            }, {}),
        );
    }
}

module.exports = function(orderRepository) {
    return async function createOrder(clientEmail, menuItemId, quantity) {
        const menuItem = await orderRepository.getMenuItemById(menuItemId);
        if (!menuItem) {
            throw new ModelValidationError(Order.constructor.name, {
                menuItem: 'Does not exist',
            });
        }

        let order = new Order({
            clientEmail: new ClientEmail({value: clientEmail}),
            menuItem: menuItem,
            quantity: quantity,
        });
        validateOrder(order);
        const orderId = await orderRepository.createOrder(order);
        order = await orderRepository.getOrderById(orderId);
        return order;
    };
};
