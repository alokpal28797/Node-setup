import { connectDb } from "./app/db/index.js";
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import userRouter from "./app/routes/user.routes.js";

dotenv.config({
    path: './.env'
})

const app = express();

app.use(cors({
    origin: `${process.env.CORS_ORIGIN}`,
    credentials: true,
}));


app.use(express.json({ limit: '16kb' })) // to parse body data
app.use(express.urlencoded({ extended: true, limit: '16kb' })) // to parse data pased from url
app.use(express.static("public")) //  to store file folders
app.use(cookieParser());  // to store cookies from server to browser securely

// routes import

app.use('/api/v1/users',userRouter)

connectDb()
    .then(() => {
        app.on('error', (error) => {
            console.log(error);
            throw error;
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server listening on ${process.env.PORT || "8000"} `)
        })
    })
    .catch(err => {
        console.error(err);
    });