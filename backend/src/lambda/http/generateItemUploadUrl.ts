import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {generateUploadUrl} from "../../businessLogic/ToDo";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing Event ", event);
    const todoId = event.pathParameters.todoId;

    try {
        const objectsignedURL :string = await generateUploadUrl(todoId);

        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                uploadUrl: objectsignedURL
            })
        };
    } catch(err){
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ err })
        };
    }
}
