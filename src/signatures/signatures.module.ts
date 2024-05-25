import { Module } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { SignaturesController } from './signatures.controller';
import { Signature } from './entities/signature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetitionsModule } from 'src/petitions/petitions.module';
import { Petition } from 'src/petitions/entities/petition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Signature, Petition])],
  controllers: [SignaturesController],
  providers: [SignaturesService],
  exports: [SignaturesService],
})
export class SignaturesModule {}
