import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './multer/files.module';
import { SongsModule } from './songs/songs.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://EightBasson:wrZzz5ml7hoT8Uf4@cluster1.gfmjqjx.mongodb.net/?retryWrites=true&w=majority',
    ),
    AuthModule,
    FilesModule,
    SongsModule,
  ],
})
export class AppModule {}
