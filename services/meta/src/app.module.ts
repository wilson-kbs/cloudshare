import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { MetaModule } from './meta/meta.module';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';

let urlMongo = `mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

@Module({
  imports: [
    MongooseModule.forRoot(urlMongo, {
      useNewUrlParser: true,
      useCreateIndex: true,
      user: process.env.MONGO_INITDB_USERNAME,
      pass: process.env.MONGO_INITDB_PASSWORD,
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));

        return connection;
      },
    }),
    MetaModule,
    DatabaseModule,
    UploadModule,
    AuthModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
