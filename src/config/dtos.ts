import {IUserSchema} from "../schemas/User";


export class UserDto {
    email;
    id;
    isActivated;

    constructor(model: IUserSchema) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}