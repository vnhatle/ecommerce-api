module.exports = {
    REGION: "us-east-1",

    PRODUCTS_TABLE: "Products",
    CART_TABLE: "Carts",
    ORDER_TABLE: "Orders",

    SNS_TOPIC_ARN: "arn:aws:sns:us-east-1:124931565609:OrderNotification",

    PROVISIONED_THROUGHPUT: {
        ReadCapacityUnits: 5, // Adjust read capacity units for your tables
        WriteCapacityUnits: 5, // Adjust write capacity units for your tables
    },
};
