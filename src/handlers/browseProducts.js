const { unmarshall } = require("@aws-sdk/util-dynamodb");
const dynamoDbService = require("../services/dynamoDbService");

exports.handler = async (event) => {
    try {
        const data = await dynamoDbService.getAllProducts();

        return {
            statusCode: 200,
            body: unmarshall(data),
        };
    } catch (error) {
        console.error("Error retrieving products:", error);
        return {
            statusCode: 500,
            body: { error: error.message },
        };
    }
};
