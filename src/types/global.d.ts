declare namespace Express {
  interface Request {
    file: Multer.File;
    files: Multer.File[];
  }
}
