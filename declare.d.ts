import {IUserSchema} from "./src/schemas/User";

declare namespace Express {
    export interface Request {
        user?: IUserSchema;
    }
}