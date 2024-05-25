import { Module } from '@nestjs/common';
import { PetitionsService } from './petitions.service';
import { PetitionsController } from './petitions.controller';
import { Petition } from './entities/petition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignaturesModule } from 'src/signatures/signatures.module';

@Module({
  imports: [TypeOrmModule.forFeature([Petition]), SignaturesModule],
  controllers: [PetitionsController],
  providers: [PetitionsService],
})
export class PetitionsModule {}
