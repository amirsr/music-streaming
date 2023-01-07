import { fromJSON, KMeans, setBackend, StandardScaler } from 'scikitjs';
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs/promises';
import path from 'path';
import extractFeatures, { decodeAudio } from "./features-extraction.service";

setBackend(tf);

const MODEL_FILE = path.join(__dirname, 'model.json');

let model: KMeans;

export const load = async () => {
    try {
        const data = await fs.readFile(MODEL_FILE);
        model = await fromJSON(data.toString());
    } catch {
        model = new KMeans();
    }
};

export const save = async () => {
    const data = await model.toJSON();
    await fs.writeFile(MODEL_FILE, data);
};
export const trainWithAudio = async ( dir: string ) => {
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
    model.fit(vector);
};
const getModel = () => model;
export default getModel;