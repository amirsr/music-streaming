import { Injectable } from "@nestjs/common";
import { FilesService } from "../multer/files.service";
import { KMeans, StandardScaler } from "scikitjs";
import { ObjectId } from "mongodb";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SongDocument } from "./songs.model";
import extractFeatures, { decodeAudio } from "./features-extraction.service";

@Injectable()
export class PredictionService {
  constructor( @InjectModel("songs") private readonly songsModel: Model<SongDocument>,
               private fileService: FilesService ) {
  }

  async predictFromGridFS(
    model: KMeans,
    filename: string
  ): Promise<number> {
    const bucket = this.fileService.getBucket();
    const stream = bucket.openDownloadStreamByName(filename);

    // Decode file stream from GridFS
    const audioData = await decodeAudio(stream);
    const features = extractFeatures(audioData);

    // Standardize features
    const data = new StandardScaler().fitTransform([features]);

    const output = await model.predict(data).array();
    return output[0];
  };

  async getFavouriteCluster( songIds: ObjectId[] ) {

    // Since there are 8 total clusters for the model
    const clusters: number[] = new Array(8).fill(0);


    // Get the cluster from each favourite song
    const songs = await this.songsModel.collection
      .find({ _id: { $in: songIds } }, { projection: { cluster: 1 } })
      .toArray();

    // Keep track of the number of songs with a certain cluster
    for ( const song of songs ) {
      clusters[song.cluster]++;
    }

    // Remember that each array index corresponds to the cluster number
    return clusters.indexOf(Math.max(...clusters));
  };

  async getSuggestions( cluster: number, exclude: ObjectId[] ) {

    const songs = await this.songsModel.collection
      .find({ cluster, _id: { $nin: exclude } }, { projection: { _id: 1 } })
      .toArray();
    return songs.map(( song ) => song._id);
  };
}
