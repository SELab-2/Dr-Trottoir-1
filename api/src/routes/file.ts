import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing} from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import multer from 'multer'
import { Request, Response } from 'express';
import path from 'path'

const router = express.Router();

//create multer object (multer saves files to direcotry files)

//with this code he will download the file
// const fileUpload = multer({
//     dest: 'files',
// });

const fileUpload = multer({
    storage: multer.diskStorage({
        destination:  function (req,file,cb){
            cb(null, 'files/');
        },
        filename: function (req,file,cb){
            cb(null,file.originalname);
        }
    })
});


// file upload route (single file: .single(),multiple file: .array() )
router.post('/',fileUpload.single('file'), (req: Request, res: Response) => { 
    console.log(req.file);
    res.json('/file'); 
});

// file get route
router.get('/:filename', (req: Request, res: Response) => {
    const { filename } = req.params;
    const dirname = path.resolve();
    const filePath = path.join(dirname, 'files/' + filename);
    return res.sendFile(filePath);
});


export {router as FileRouter}