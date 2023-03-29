//import { prisma } from "../prisma";
import express from "express";
import { CustomRequest, Routing} from "./routing";
import { Auth } from "../auth/auth";
import { Parser } from "../parser";
import multer from 'multer'
import { Request, Response } from 'express';
import path from 'path'
import { PrismaClient } from '@prisma/client';
import { prisma } from "../prisma";

const router = express.Router();
//const prisma = new PrismaClient();

//create multer object (multer saves files to direcotry files)
// get request will download the file
// const fileUpload = multer({
//     dest: 'files',
// });

//creates multer object 
//get request will show file in browser
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
router.post('/',fileUpload.single('file'), async (req: Request, res: Response) => { 
    //console.log(req.file);
    try {
        // save the file to the database using Prisma
        const result = await prisma.file.create({
          data: req.body
        });
        // return the saved file as JSON
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save file' });
      }
});

// file get route
router.get('/:id', async (req: Request, res: Response) => {
    // const { filename } = req.params;
    // const dirname = path.resolve();
    // const filePath = path.join(dirname, 'files/' + filename);
    try {
        // Look up the file in the database using Prisma
        console.log("hier")
        console.log(req.params);
        const result = await prisma.file.findUniqueOrThrow({
            where: {
                id: Parser.number(req.params["id"]),
            },
        });

        if (!result) {
          res.status(404).json({ error: 'File not found' });
          return;
        }

        // Send the file to the client
        console.log(result);
        const dirname = path.resolve();
        res.sendFile(path.join(dirname, result.path));
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve file' });
      }
    //return res.sendFile(filePath);
});


export {router as FileRouter}