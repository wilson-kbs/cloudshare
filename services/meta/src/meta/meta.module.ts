import { Module } from '@nestjs/common';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { DatabaseModule } from '@database/module'
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [MetaController],
  providers: [MetaService]
})
export class MetaModule {}
