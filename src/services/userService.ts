import {UserModel} from "../schemas";
import {ApiError} from "../core/apiErrors";
import bcrypt from "bcrypt";
import * as uuid from 'uuid';
import {mailService} from "./mailService";
import {UserDto} from "../config/dtos";
import {IUserSchema} from "../schemas/User";
import {tokenCtrl} from "../controllers/TokenControllers";

class UserService {
    async showAll() {
        UserModel.find({}, (err: any, user: any[]) => {
            if(err){
                throw ApiError.BadRequest('Нет юзеров')
            }
            user.splice(6)
            return  user.map((item) => ({fullName: item.fullName, avatar: item.avatar,  locationWork: item.locationWork, experience: item.experience}))
        })
    }

    async getPerson(id: string) {
        UserModel.findById(id, (err: any, user: any) => {
            if(err){
                throw ApiError.BadRequest('Юзер не найден')
            }
            return user
        })
    }

    async changeMyProfile(id: string, data: IUserSchema) {
        UserModel.findOneAndUpdate({_id: id}, data, {new: true}, (err: any,) => {
            console.log(data, id)
            if(err){
                throw ApiError.BadRequest('Юзер не найден')
            }
            return data;
        })
    }


    remove = (id: string) =>  {
        UserModel.findOneAndRemove({_id: id},{}, (err) => {
            if(err){
                throw ApiError.BadRequest('Юзер не найден')
            }
            return "success"
        })
    }

    async registration(email:string, password:string, isPhotograph: boolean,  fullName:string, userName:string) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await UserModel.create({email, isPhotograph,  fullName, userName, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.CLIENT_URL}/user/activate/${activationLink}`);
        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenCtrl.generateTokens({...userDto});
        await tokenCtrl.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink:string) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email:string, password:string) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, String(user.password));
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenCtrl.generateTokens({...userDto});

        await tokenCtrl.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken:string) {
        const token = await tokenCtrl.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken:string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenCtrl.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenCtrl.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        if(user){
            const userDto = new UserDto(user);
            const tokens = tokenCtrl.generateTokens({...userDto});

            await tokenCtrl.saveToken(userDto.id, tokens.refreshToken);
            return {...tokens, user: userDto}
        }
    }
}

export const userService = new UserService();