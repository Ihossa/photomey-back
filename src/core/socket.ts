import socket from "socket.io";
import http from "http";


export default (http: http.Server) => {
    const io = require("socket.io")(http);

    io.on('connection', (socket:socket.Socket) => {
        console.log('a user connected');

        socket.on('message', (msg:any) => {
            // console.log('message: ' + msg);
            io.emit('message32', msg)
        });
    });


    io.on('disconnection', (socket:socket.Socket) => {
        console.log('a user disconnection');
        io.emit('111', '12345')

        socket.on('222', (msg:string) => {
            console.log('message: ' + msg);
        });
    });

    return io
}


