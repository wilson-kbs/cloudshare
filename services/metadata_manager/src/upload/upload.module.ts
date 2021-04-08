import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/module';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [DatabaseModule],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
