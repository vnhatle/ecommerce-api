const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const config = require("../config/config");

const ddbClient = new DynamoDBClient({ region: config.REGION });

const PRODUCTS_TABLE = config.PRODUCTS_TABLE;
const CART_TABLE = config.CART_TABLE;
const ORDER_TABLE = config.ORDER_TABLE;

async function getAllProducts() {
    const params = {
        TableName: PRODUCTS_TABLE,
    };

    const data = await ddbClient.send(new ScanCommand(params));
    return data.Items;
}

async function updateCart(email, productId, quantity) {
    try {
        const getParams = {
            TableName: CART_TABLE,
            Key: { email: { S: email } },
        };

        const cartData = await ddbClient.send(new GetItemCommand(getParams));

        let updatedCart;

        if (cartData.Item && cartData.Item.products) {
            const existingProductIndex = cartData.Item.products.L.findIndex(
                (product) => product.M.productId.S === productId
            );

            if (existingProductIndex > -1) {
                cartData.Item.products.L[existingProductIndex].M.quantity.N = (
                    parseInt(
                        cartData.Item.products.L[existingProductIndex].M
                            .quantity.N
                    ) + quantity
                ).toString();
            } else {
                cartData.Item.products.L.push({
                    M: {
                        productId: { S: productId },
                        quantity: { N: quantity.toString() },
                    },
                });
            }
        } else {
            updatedCart = {
                email,
                products: [
                    {
                        M: {
                            productId: { S: productId },
                            quantity: { N: quantity.toString() },
                        },
                    },
                ],
            };
        }

        const putParams = {
            TableName: CART_TABLE,
            Item: updatedCart || cartData.Item,
        };

        await ddbClient.send(new PutItemCommand(putParams));
    } catch (error) {
        throw error;
    }
}

async function placeOrder(email, cart, shippingAddress, paymentMethod) {
    try {
        const orderId = `ORDER-${Date.now()}`;
        const order = {
            orderId,
            email,
            items: cart.products,
            shippingAddress,
            paymentMethod,
            status: "Processing",
            createdAt: new Date().toISOString(),
        };

        const orderParams = {
            TableName: ORDER_TABLE,
            Item: order,
        };

        await ddbClient.send(new PutItemCommand(orderParams));
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllProducts,
    updateCart,
    placeOrder,
};
