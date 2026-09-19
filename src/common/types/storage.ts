export interface FileData {
    fileName: string;
    fileData: ArrayBufferLike;
}

export interface FileStorage {
    uploadFile(data: FileData): Promise<void>;
    deleteFile(filename: string): Promise<void>;
    getObjectUri(filename: string): Promise<string>;
}
