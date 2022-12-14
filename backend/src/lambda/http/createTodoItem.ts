import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {CreateTodoRequest} from '../../requests/CreateTodoRequest';
import {createToDo} from "../../businessLogic/ToDo";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item
    console.log("Processing Event ", event);
    const authorization = event.headers.Authorization;
    const separateauthHeader = authorization.split(' ');
    const jwtToken = separateauthHeader[1];

    const newTodo: CreateTodoRequest = JSON.parse(event.body);

    try{
        const toDoItem = await createToDo(newTodo, jwtToken);
        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                "item": toDoItem
            }) 
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ err })
        };
    }
    
};
