import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from "mongodb";

export type SongDocument = Song & Document;

@Schema()
export class Song {
  @Prop()
  userId: string;
  @Prop()
  filename: string;
  @Prop()
  mimeType: string;
  @Prop()
  title: string;
  @Prop()
  genre?: string;
  @Prop()
  release?: Date;
  @Prop()
  duration: number;
  @Prop()
  lyrics?: string;
  @Prop()
  uploaded: Date;
  @Prop()
  cluster: number;
}
export const SongSchema = SchemaFactory.createForClass(Song);