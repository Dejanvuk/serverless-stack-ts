import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const main = handler(async (event : APIGatewayEvent, context : Context) : Promise<APIGatewayProxyResult> => {
  const params = {
    TableName: process.env.tableName!,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    // partition key
    KeyConditionExpression: "userId = :userId",
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId,
    },
  };
  const result = await dynamoDb.query(params);
  // Return the matching list of items in response body
  return {statusCode: 200, body: JSON.stringify(result.Items)};
});
