const dynamoDbService = require("../services/dynamoDbService");
const snsService = require("../services/snsService");

exports.handler = async (event) => {
    const { email, cart, shippingAddress, paymentMethod } = JSON.parse(
        event.body
    );

    try {
        await dynamoDbService.placeOrder(
            email,
            cart,
            shippingAddress,
            paymentMethod
        );

        await snsService.sendNotification(
            `New order placed by ${email}. Order ID: ${orderId}`
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Order placed successfully",
                orderId,
            }),
        };
    } catch (error) {
        console.error("Error placing order:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
