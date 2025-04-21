const dynamoDbService = require("../services/dynamoDbService");
const snsService = require("../services/snsService");

exports.handler = async (event) => {
    const { cart, shippingDetails, paymentMethod } = event.body;

    // const { email } = event.requestContext.authorizer.claims;
    const email = "lenhatdev@gmail.com";

    try {
        const orderId = `ORDER-${Date.now()}`;
        await dynamoDbService.placeOrder(
            email,
            cart,
            shippingDetails,
            paymentMethod
        );

        await snsService.sendNotification(
            `New order placed by ${email}. Order ID: ${orderId}`
        );

        return {
            statusCode: 200,
            body: {
                message: "Order placed successfully",
                orderId,
            },
        };
    } catch (error) {
        console.error("Error placing order:", error);
        return {
            statusCode: 500,
            body: { error: error.message },
        };
    }
};
