import {DialogCtrl, MessageCtrl,  UserCtrl} from "../controllers";
import {LoginValidation} from "../utils/validation";
import bodyParser from "body-parser";
import {checkAuth, updateLastSeen} from "../middleware";
import socket from 'socket.io'

export const createRoutes = (app:any, io: socket.Server) => {

    app.use(bodyParser.json());
    app.use(updateLastSeen)
    app.use(checkAuth)




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
