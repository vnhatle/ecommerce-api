module.exports = {
    REGION: "us-east-1",

    PRODUCTS_TABLE: "Products",
    USERS_TABLE: "Users",
    CART_ITEM_TABLE: "CartItem",
    ORDER_TABLE: "Order",

    SNS_TOPIC_ARN: "arn:aws:sns:us-east-1:124931565609:OrderNotification",

    PROVISIONED_THROUGHPUT: {
        ReadCapacityUnits: 5, // Adjust read capacity units for your tables
        WriteCapacityUnits: 5, // Adjust write capacity units for your tables
    },
};
