import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.CLOUDSHARE_WEB_BASEPATH);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:' + process.env.GRPC_LISTEN_PORT,
      package: 'meta',
      protoPath: join(__dirname, '../proto/meta.proto'),
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(process.env.CLOUDSHARE_WEB_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
