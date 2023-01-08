import * as tf from '@tensorflow/tfjs-node';
import * as sk from 'scikitjs'
import fs from 'fs/promises';
import path from 'path';
import extractFeatures, { decodeAudio } from "./features-extraction.service";
import { Injectable } from "@nestjs/common";
import { fromJSON, KMeans, StandardScaler } from "scikitjs";

const MODEL_FILE = path.join(__dirname, 'model.json');

@Injectable()
export class KMeansService {
    public model: KMeans;
    constructor( ) {
        sk.setBackend(tf);
    }

    async load(){
        try {
            const data = await fs.readFile(MODEL_FILE);
            this.model = await fromJSON(data.toString());
        } catch {
            this.model = new KMeans();
        }
    };

    async save(){
        const data = await this.model.toJSON();
        await fs.writeFile(MODEL_FILE, data);
    };

    async trainWithAudio ( dir: string ) {
        const files = await fs.readdir(dir);

        const data: number[][] = [];

        let filename: string;

        for ( let i = 0; i < files.length; i++ ) {
            filename = files[i];
            const filepath = path.join(dir, filename);

            const audioData = await decodeAudio(filepath);
            const features = extractFeatures(audioData);

            console.log(i, features);
            data.push(features);
        }

        const vector = new StandardScaler().fitTransform(data);
        console.log('data', vector.arraySync());
        this.model.fit(vector);
    };
}