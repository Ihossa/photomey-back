import {connect} from "mongoose";

export const connectDB = connect("mongodb+srv://Ihossa:Ihossa17@photome0.orjbk.mongodb.net/PhotomeDB",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });