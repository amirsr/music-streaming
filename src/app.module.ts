import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://EightBasson:wrZzz5ml7hoT8Uf4@cluster1.gfmjqjx.mongodb.net/?retryWrites=true&w=majority',
    ),
    AuthModule,
  ],
})
export class AppModule {}
