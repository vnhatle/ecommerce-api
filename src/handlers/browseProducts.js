const dynamoDbServicenfig = require("../services/dynamoDbService");

exports.handler = async (event) => {
    try {
        const data = await dynamoDbServicenfig.getAllProducts();

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        console.error("Error retrieving products:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
