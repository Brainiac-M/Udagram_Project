import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {deleteToDo} from "../../businessLogic/ToDo";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing Event ", event);
    const authorization = event.headers.Authorization;
    const separateauthHeader = authorization.split(' ');
    const jwtToken = separateauthHeader[1];

    try{
        const todoId = event.pathParameters.todoId;

        await deleteToDo(todoId, jwtToken);

        return {
            statusCode: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: undefined,
        }
    } catch (err){
        return{
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({err})
        };
    }
    
};
