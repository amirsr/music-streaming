import { Module } from "@nestjs/common";
import { SongsController } from "./songs.controller";
import { SongsService } from "./songs.service";
import { PredictionService } from "./prediction.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SongSchema } from "./songs.model";
import { MulterModule } from "@nestjs/platform-express";
import { GridFsMulterConfigService } from "../multer/multer.service";
import { KMeansService } from "./kmeans.service";

@Module({
  imports: [MulterModule.registerAsync({
    useClass: GridFsMulterConfigService
  }), MongooseModule.forFeature([{ name: "songs", schema: SongSchema }])],
  controllers: [SongsController],
  providers: [GridFsMulterConfigService,SongsService, PredictionService,KMeansService]
})
export class SongsModule {
}