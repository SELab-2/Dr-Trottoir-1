import express from "express";
import { Auth } from "../auth/auth";
import { APIError } from "../errors/api_error";
import { APIErrorCode } from "../errors/api_error_code";
import * as nodemailer from "nodemailer";

export type CustomRequest = express.Request<any>;

export class MailRouting {
    @Auth.authorization({ superStudent: true })
    async sendMail(req: CustomRequest, res: express.Response) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT ?? "NaN"),
            auth: {
                user: process.env.SMTP_MAIL_ADDRESS,
                pass: process.env.SMTP_MAIL_PASSWORD,
            },
        });

        // Verify connection configuration
        if (!(await transporter.verify())) {
            console.log("WARNING: Invalid SMTP Credentials");
            throw new APIError(APIErrorCode.INTERNAL_SERVER_ERROR);
        }

        try {
            await transporter.sendMail({
                from: process.env.SMTP_MAIL_ADDRESS,
                to: req.body["to"],
                subject: req.body["subject"],
                text: req.body["content"],
            });
        } catch (e) {
            throw new APIError(APIErrorCode.BAD_REQUEST);
        }

        return res.status(201).json({});
    }

    toRouter(): express.Router {
        const router = express.Router();
        router.post("/", this.sendMail);
        return router;
    }
}
