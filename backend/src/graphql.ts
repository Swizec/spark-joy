import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent): Promise<any> => {
    return {
        statusCode: 200,
        body: "Hello world"
    };
};
