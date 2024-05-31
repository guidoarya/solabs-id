import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from './multer.config';

@Module({
  imports: [
    MulterModule.register({
      storage: multerOptions.storage,
      fileFilter: multerOptions.fileFilter,
    }),
  ],
  exports: [MulterModule],
})
export class AppMulterModule {}
