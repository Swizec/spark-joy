import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

interface UpdateItemParams {
    TableName?: string;
    Key: {
        [key: string]: string;
    };
    UpdateExpression: string;
    ExpressionAttributeValues: {
        [key: string]: string | number;
    };
}

interface GetItemParams {
    TableName?: string;
    Key: {
        [key: string]: string;
    };
}

interface ScanItemsParams {
    TableName?: string;
}

export const updateItem = async (params: UpdateItemParams) => {
    const query = {
        TableName: process.env.DYNAMODB_TABLE!,
        ...params
    };

    return new Promise((resolve, reject) => {
        dynamoDB.update(query, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

export const getItem = async (
    params: GetItemParams
): Promise<AWS.DynamoDB.DocumentClient.GetItemOutput> => {
    const query = {
        TableName: process.env.DYNAMODB_TABLE!,
        ...params
    };

    return new Promise((resolve, reject) => {
        dynamoDB.get(query, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

export const scanItems = async (
    params: ScanItemsParams
): Promise<AWS.DynamoDB.DocumentClient.ScanOutput> => {
    const query = {
        TableName: process.env.DYNAMODB_TABLE!,
        ...params
    };

    return new Promise((resolve, reject) => {
        dynamoDB.scan(query, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
