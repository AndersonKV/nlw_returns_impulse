import express from 'express';
import nodemailer from 'nodemailer'
import { prisma } from './prisma';
import cors from 'cors'
import routes from './routes';

const app = express();

// app.use(cors({
//     origin: 'http://localhost:3000/'
// }))

app.use(cors());
app.use(express.json())
app.use(routes)
app.use(express.urlencoded({ extended: true }));


app.listen(process.env.SERVER || 3333)

