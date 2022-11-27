import express from "express"
import {connectDB} from "./src/config/db";
import dotenv from 'dotenv'
import createSocket from './src/core/socket'
import {createServer} from "http"
import {createRoutes} from "./src/routes";
import cors from "cors";
import cookieParser from 'cookie-parser'


const app = express()
const http = createServer(app);
const io = createSocket(http);
app.use(cookieParser());
app.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:3000'
    }
));


createRoutes(app, io)
dotenv.config()


async function start() {
    try {
        await connectDB
        http.listen(process.env.PORT, function () {
            console.log(process.env.PORT)
        })
    } catch (err) {
        console.log(err)
    }
}

start()



