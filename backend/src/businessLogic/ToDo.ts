import {TodoItem} from "../models/TodoItem";
import {parseUserId} from "../auth/utils";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {TodoUpdate} from "../models/TodoUpdate";
import {ToDoAccess} from "../dataLayer/ToDoAccess";

const uuidv4 = require('uuid/v4');
const newtoDoAccess = new ToDoAccess();

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
    const theuserId = parseUserId(jwtToken);
    return newtoDoAccess.getAllToDoItems(theuserId);
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const theuserId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const s3BucketName = process.env.SERVERLESS_S3_BUCKET_NAME;
    
    return newtoDoAccess.createToDoItem({
        userId: theuserId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return newtoDoAccess.updateToDoItem(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return newtoDoAccess.deleteToDoItem(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return newtoDoAccess.generateItemUploadUrl(todoId);
}