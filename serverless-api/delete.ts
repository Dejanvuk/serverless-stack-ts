import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const main = handler(async (event : APIGatewayEvent, context : Context) : Promise<APIGatewayProxyResult> => {
  const params = {
    TableName: process.env.tableName!,
    // 'Key' defines the partition key and sort key of the item to be removed
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId, // The id of the author
      noteId: event.pathParameters!.id, // The id of the note from the path
    },
  };

  await dynamoDb.delete(params);

  return {statusCode: 200, body: ''};
});
