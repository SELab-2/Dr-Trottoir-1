import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing} from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import multer from 'multer'
import { Request, Response } from 'express';

const router = express.Router();

//create multer object (multer saves files to direcotry files)
const fileUpload = multer({
    dest: 'files',
});


// file upload route (single file: .single(),multiple file: .array() )
router.post('/',fileUpload.single('file'), (req: Request, res: Response) => { 
    console.log(req.file);
    res.json('/file'); 
});

// file get route
router.get('/:id', (req: Request, res: Response) => {
    res.json('/file/:id');
});


export {router as FileRouter}









// export class FileRouting extends Routing {

//     @Auth.authorization({ superStudent: true })
//     async createOne(req: CustomRequest, res: express.Response) {
//         const result = await prisma.file.create({
//             data: req.body,
//         });
//         return res.status(201).json(result);
//     }


//     @Auth.authorization({ student: true })
//     async getOne(req: CustomRequest, res: express.Response) {

//         const result = await prisma.file.findUniqueOrThrow({
//             where: {
//                 id: Parser.number(req.params["id"]),
//             },
//             select: {
                
//             },
//         });

//         return res.status(200).json(result);
//     }
// }