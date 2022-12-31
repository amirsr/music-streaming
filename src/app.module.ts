import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './multer/files.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      '',
    ),
    AuthModule,
    FilesModule,
  ],
})
export class AppModule {}
