const dynamoDbService = require("../services/dynamoDbService");

exports.handler = async (event) => {
    try {
        const data = await dynamoDbService.getAllProducts();

        return {
            statusCode: 200,
            body: data,
        };
    } catch (error) {
        console.error("Error retrieving products:", error);
        return {
            statusCode: 500,
            body: { error: error.message },
        };
    }
};
