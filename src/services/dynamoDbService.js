const {
    DynamoDBClient,
    ScanCommand,
    GetItemCommand,
    PutItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const config = require("../config/config");

const ddbClient = new DynamoDBClient({ region: config.REGION });

const PRODUCTS_TABLE = config.PRODUCTS_TABLE;
const CART_ITEM_TABLE = config.CART_ITEM_TABLE;
const USERS_TABLE = config.USERS_TABLE;
const ORDER_TABLE = config.ORDER_TABLE;

async function getAllProducts() {
    const params = {
        TableName: PRODUCTS_TABLE,
    };

    const data = await ddbClient.send(new ScanCommand(params));
    return data.Items;
}

async function findProductById(productId) {
    const params = {
        TableName: PRODUCTS_TABLE,
        Key: { id: { S: productId } },
    };

    const productData = await ddbClient.send(new GetItemCommand(params));
    return productData.Item;
}

async function updateCart(email, productId, quantity) {
    try {
        const product = await findProductById(productId);

        if (!product) {
            throw new Error("Product is not exist");
        }

        const getParams = {
            TableName: CART_ITEM_TABLE,
            Key: { email: { S: email } },
        };

        const cartData = await ddbClient.send(new GetItemCommand(getParams));

        let updatedCart;

        if (cartData && cartData.Item && cartData.Item.products) {
            const existingProductIndex = cartData.Item.products.L.findIndex(
                (product) => product.M.product.M.productId.S === productId
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
                email: { S: email },
                products: {
                    L: [
                        {
                            M: {
                                productId: { S: productId },
                                quantity: { N: quantity.toString() },
                            },
                        },
                    ],
                },
            };
        }

        const putParams = {
            TableName: CART_ITEM_TABLE,
            Item: updatedCart || cartData.Item,
        };

        await ddbClient.send(new PutItemCommand(putParams));
    } catch (error) {
        throw error;
    }
}

async function placeOrder(
    orderId,
    email,
    cart,
    shippingDetails,
    paymentMethod
) {
    try {
        const totalPrice = cart.products.reduce(
            (acc, product) => acc + product.price * quantity,
            0
        );

        const products = cart.products.map((p) => {
            return {
                productId: { S: p.productId },
                quantity: { N: p.quantity },
            };
        });

        shippingDetails = marshall(shippingDetails);

        const order = marshall({
            orderId: orderId,
            email: email,
            items: products,
            total: totalPrice,
            shippingDetails: shippingDetails,
            paymentMethod: paymentMethod,
            createdAt: new Date().toISOString(),
        });

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
    findProductById,
    updateCart,
    placeOrder,
};
