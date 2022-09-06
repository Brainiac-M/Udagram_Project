import {TodoUpdate} from "../models/TodoUpdate";
import {ToDoAccess} from "../dataLayer/ToDoAccess";
import {TodoItem} from "../models/TodoItem";
import {parseUserId} from "../auth/utils";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import * as uuid from 'uuid'


const newtoDoAccess = new ToDoAccess();

//Get all items a user is authorized to work with 
export const getAllToDo = async(jwtToken: string): Promise<TodoItem[]> => {
    const theuserId = parseUserId(jwtToken);
    return newtoDoAccess.getAllToDoItems(theuserId);
}

//Allow user to create an item bassed on the item object template
export function createToDo(ToDoData: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    // const s3BucketName = process.env.SERVERLESS_S3_BUCKET_NAME;
    const todoId = uuid.v4()
    const userId = parseUserId(jwtToken)
    const createdAt = new Date().toISOString();
    const done = false;
    
    // Return new item created and assigns new todoId to the item
    const todoTemplate = { 
    todoId,
    userId,
    createdAt,
    done,
    ...ToDoData
}
    return newtoDoAccess.createToDoItem(todoTemplate);
}

// Delete item after confirming that user is authorized. Only one item can be deleted at a time using the todoId of the item 
export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return newtoDoAccess.deleteToDoItem(todoId, userId);
}

// Creates image upload URL 
export function generateUploadUrl(todoId: string): Promise<string> {
    return newtoDoAccess.generateItemUploadUrl(todoId);
}

// update a specific item after user has be authorized
export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return newtoDoAccess.updateToDoItem(updateTodoRequest, todoId, userId);
}