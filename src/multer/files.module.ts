import { Module } from '@nestjs/common';
import { MulterModule } from "@nestjs/platform-express";
import { GridFsMulterConfigService } from "./multer.service";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SongSchema } from "../songs/songs.model";

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),MongooseModule.forFeature([{ name: 'songs', schema: SongSchema }])
  ],
  controllers: [FilesController],
  providers: [GridFsMulterConfigService, FilesService],
  exports:[FilesService],
})
export class FilesModule {}
