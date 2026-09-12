import mongoose from "mongoose";
import config from "config";

export const initDB = async () => {
    const dbUri: string = config.get("database.uri");
    await mongoose.connect(dbUri);
};
