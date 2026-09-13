import { Request } from "express";

export type AuthCookie = {
    accessToken: string;
    refreshToken: string;
};
export interface RequestAuth extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
    };
}
