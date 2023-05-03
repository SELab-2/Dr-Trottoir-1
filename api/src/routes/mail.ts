import express from "express";
import {Auth} from "../auth/auth";
import {APIError} from "../errors/api_error";
import {APIErrorCode} from "../errors/api_error_code";
import * as nodemailer from "nodemailer";

export type CustomRequest = express.Request<any>;

export class MailRouting {
    @Auth.authorization({ superStudent: true })
    async sendMail(req: CustomRequest, res: express.Response) {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 587,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // verify connection configuration
        transporter.verify((error, succes) => {
            if (error) {
                console.log(error);
                throw new APIError(APIErrorCode.BAD_REQUEST)
            } else {
                console.log("Email is ready to be sent");
            }
        });

        await transporter.sendMail({
            from: process.env.MAIL_ADDRESS,
            to: req.body["to"],
            subject: req.body["subject"],
            text: req.body["content"],
        }, (err, info) => {
            if (err) {
                console.log(err);
                throw new APIError(APIErrorCode.BAD_REQUEST);
            }
        });

        return res.status(250).json({});
    }

    toRouter(): express.Router {
        const router = express.Router();
        router.post("/", this.sendMail);
        return router;
    }
}
