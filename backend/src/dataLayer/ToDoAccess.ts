import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Types } from 'aws-sdk/clients/s3';
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";


export class ToDoAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly todoTable = process.env.SERVERLESS_TODOS_TABLE,
        private readonly s3BucketName = process.env.SERVERLESS_S3_BUCKET_NAME
    ){}



    async getAllToDoItems(userId: string): Promise<TodoItem[]> {
        console.log("Getting all todo items");

        const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        }).promise();

        console.log(result);
        const items = result.Items;

        return items as TodoItem[];
    }

    async getTodo(userId: string, todoId: string): Promise<TodoItem> {
        const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: 'userId = :userId and todoId = :todoId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':todoId': todoId
            }
        }).promise();

        const todoItem = result.Items[0];  //first item will be selected
        return todoItem as TodoItem;
      }


    async createToDoItem(todoItem: TodoItem): Promise<TodoItem> {
        console.log("Creating new todo item");

        const params = {
            TableName: this.todoTable,
            Item: todoItem,
        };

        const result = await this.docClient.put(params).promise();
        console.log(result);

        return todoItem as TodoItem;
    }

    async updateToDoItem(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
        console.log("Updating todo item");

        const result = await this.docClient.update({
            TableName: this.todoTable,
            Key: {userId, todoId},
            UpdateExpression: "set #n = :name, #due = :dueDate, #done = :done",
            ExpressionAttributeNames: {
                "#n": "name",
                "#due": "dueDate",
                "#done": "done"
            },
            ExpressionAttributeValues: {
                ":name": todoUpdate['name'],
                ":dueDate": todoUpdate['dueDate'],
                ":done": todoUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        }).promise();

        const attributes = result.Attributes;

        return attributes as TodoUpdate;
    }



    async deleteToDoItem(todoId: string, userId: string): Promise<string> {
        console.log("Deleting todo item");

        const result =  await this.docClient.delete({
            TableName: this.todoTable,
            Key: {userId, todoId},
        }).promise()
        console.log(result);

        return "" as string;
    }



    async generateItemUploadUrl(todoId: string): Promise<string> {
        console.log("Generating URL for toDo item");

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 5000,
        });
        console.log(url);

        return url as string;
    }
}