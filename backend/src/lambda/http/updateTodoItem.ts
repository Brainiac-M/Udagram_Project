import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {updateToDo} from "../../businessLogic/ToDo";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    console.log("Processing Event ", event);
    const authorization = event.headers.Authorization;
    const separateauthHeader = authorization.split(' ');
    const jwtToken = separateauthHeader[1];
    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

    try{
        await updateToDo(updatedTodo, todoId, jwtToken);  //const toDoItem = await updateToDo(updatedTodo, todoId, jwtToken);

        return {
            statusCode: 204,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: undefined     //or body: JSON.stringify({ toDoItem }) when statusCode : 200
        };
    } catch(err){
        return {
            statusCode: 500,
            body: JSON.stringify({ err })
        };
    }

}
