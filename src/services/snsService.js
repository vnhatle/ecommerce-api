const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const config = require("../config/config");
const snsClient = new SNSClient({ region: config.REGION });

const SNS_TOPIC_ARN = config.SNS_TOPIC_ARN;

async function sendNotification(message) {
    const params = {
        Message: message,
        TopicArn: SNS_TOPIC_ARN,
    };

    try {
        await snsClient.send(new PublishCommand(params));
        console.log("Notification sent:", message);
    } catch (error) {
        console.error("Error sending SNS notification:", error);
    }
}

module.exports = {
    sendNotification,
};
