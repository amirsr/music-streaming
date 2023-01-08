import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { MongoGridFS } from "mongo-gridfs";
import { GridFSBucket, GridFSBucketReadStream } from "mongodb";
import { FileInfoVm } from "./file-info-vm.model";
import { SongDocument } from "./songs.model";
import { PredictionService } from "./prediction.service";
import { decodeAudio } from "./features-extraction.service";

@Injectable()
export class SongsService {
  private gridfs: MongoGridFS;

  constructor( @InjectConnection() private readonly connection: Connection,
               @InjectModel("songs") private readonly songsModel: Model<SongDocument>,
               private predictionService: PredictionService,) {
    this.gridfs = new MongoGridFS(this.connection.db, "fs");
  }

  getBucket(): GridFSBucket {
    return this.gridfs.bucket;
  }

  async readStream( id: string ): Promise<GridFSBucketReadStream> {
    return await this.gridfs.readFileStream(id);
  }

  async findInfo( id: string ): Promise<FileInfoVm> {
    const result = await this.gridfs
      .findById(id).catch(err => {
        throw new HttpException("song not found", HttpStatus.NOT_FOUND);
      })
      .then(result => result);
    return {
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      md5: result.md5,
      contentType: result.contentType
    };
  }

  async deleteSong( id: string ): Promise<boolean> {
    return await this.gridfs.delete(id);
  }

  async addSongsData( response: any ) {
    const stream = this.getBucket().openDownloadStreamByName(response.filename)
    const audioData = await decodeAudio(stream);
    const cluster = await this.predictionService.predictFromGridFS(audioData);
    await this.songsModel.insertMany({ ...response, cluster });
  }
}