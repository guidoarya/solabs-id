import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerConfig = {
  dest: './uploads',
};

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 1024 * 1024 * 2, // Default 2MB
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};
