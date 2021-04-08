import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Upload, UploadSchema } from './schemas/upload.schema';
import { DatabaseService } from './database.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

const UploadDataBase = MongooseModule.forFeature([
  { name: Upload.name, schema: UploadSchema },
]);

const gRPCConnectionDataStore = ClientsModule.register([
  {
    name: 'FILES_MANAGER_PACKAGE',
    transport: Transport.GRPC,
    options: {
      url: `${process.env.CLOUDSHARE_FILES_MANAGER_ADDRESS}:${process.env.GRPC_LISTEN_PORT}`,
      package: 'files',
      protoPath: join(__dirname, '../../proto/files.proto'),
      loader: {
        keepCase: true,
      },
    },
  },
]);

@Module({
  imports: [gRPCConnectionDataStore, UploadDataBase],
  exports: [UploadDataBase, DatabaseService, gRPCConnectionDataStore],
  providers: [DatabaseService],
})
export class DatabaseModule {}
