import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { FileData, FileStorage } from "../types/storage";
import config from "config";

export class S3Storage implements FileStorage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: config.get("s3.region"),
            credentials: {
                accessKeyId: config.get("s3.accessKeyId"),
                secretAccessKey: config.get("s3.secretAccessKey"),
            },
        });
    }
    async uploadFile(data: FileData): Promise<void> {
        const objectParams = {
            Bucket: config.get<string>("s3.bucketName"),
            Key: data.fileName,
            Body: Buffer.from(data.fileData),
        };
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.client.send(new PutObjectCommand(objectParams));
    }
    async deleteFile(fileName: string): Promise<void> {
        const objectParams = {
            Bucket: config.get<string>("s3.bucketName"),
            Key: fileName,
        };
        await this.client.send(new DeleteObjectCommand(objectParams));
    }
    getObjectUri(): Promise<string> {
        throw new Error("Method not implemented.");
    }
}
