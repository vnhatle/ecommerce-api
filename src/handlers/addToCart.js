const dynamoDbService = require("../services/dynamoDbService");

exports.handler = async (event) => {
    const { productId, quantity } = event.body;
    // const { email } = event.requestContext.authorizer.claims;
    const email = "lenhatdev@gmail.com";

    try {
        await dynamoDbService.updateCart(email, productId, quantity);

        return {
            statusCode: 200,
            body: {
                message: "Product added to cart successfully",
            },
        };
    } catch (error) {
        console.error("Error adding product to cart:", error);
        return {
            statusCode: 500,
            body: { error: error.message },
        };
    }
};
