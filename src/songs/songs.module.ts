import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { FilesModule } from "../multer/files.module";
import { PredictionService } from "./prediction.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SongSchema } from "./songs.model";

@Module({
  imports:[FilesModule,MongooseModule.forFeature([{ name: 'songs', schema: SongSchema }])],
  controllers: [SongsController],
  providers: [SongsService,PredictionService],
})
export class SongsModule {}
