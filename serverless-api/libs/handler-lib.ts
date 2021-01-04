import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

interface ILambda {
  (event : APIGatewayEvent, context : Context) : Promise<APIGatewayProxyResult>;
};

const handler = (lambda : ILambda) : ILambda => {
  return async function (event : APIGatewayEvent, context : Context) : Promise<APIGatewayProxyResult> {
    let body, statusCode ;
    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e) {
      body = { error: e.message };
      statusCode = 500;
    }
    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
}


export default handler;