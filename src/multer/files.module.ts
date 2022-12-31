import { Module } from '@nestjs/common';
import { MulterModule } from "@nestjs/platform-express";
import { GridFsMulterConfigService } from "./multer.service";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  controllers: [FilesController],
  providers: [GridFsMulterConfigService, FilesService],
})
export class FilesModule {}
