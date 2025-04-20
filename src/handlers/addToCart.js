const dynamoDbService = require("../services/dynamoDbService");

exports.handler = async (event) => {
    const { productId, quantity } = JSON.parse(event.body);
    const { email } = event.requestContext.authorizer.claims;

    try {
        await dynamoDbService.updateCart(email, productId, quantity);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Product added to cart successfully",
            }),
        };
    } catch (error) {
        console.error("Error adding product to cart:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
