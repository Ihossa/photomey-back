import {DialogCtrl, MessageCtrl,  UserCtrl} from "../controllers";
import {LoginValidation} from "../utils/validation";
import bodyParser from "body-parser";
import {checkAuth, updateLastSeen} from "../middleware";
import socket from 'socket.io'
import cors from "cors";

export const createRoutes = (app:any, io: socket.Server) => {

    app.use(bodyParser.json());
    app.use(updateLastSeen)
    app.use(checkAuth)
    app.use(cors())
    app.use(function (res: any) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    })


    const UserController = new UserCtrl(io);
    const DialogController = new DialogCtrl(io);
    const MessageController = new MessageCtrl(io);


    app.get('/', UserController.getUsers);
    app.get('/:id', UserController.getPerson);
    app.post("/sign-up", UserController.registration);
    app.post("/user/me/update", UserController.changeMyProfile)
    app.delete('/:id', UserController.remove)
    app.post("/user/login", LoginValidation, UserController.login)
    app.post("/user/logout", UserController.logout)
    app.get("/user/activate", UserController.activate)
    app.post("/user/refresh", UserController.refresh)


    app.get('/dialogs/:id', DialogController.index);
    app.delete('/dialogs/:id', DialogController.remove);
    app.post('/dialogs', DialogController.create)

    app.get('/messages/:dialogId', MessageController.index);
    app.post('/messages', MessageController.create);
    app.delete('/messages/:id', MessageController.remove);
}
