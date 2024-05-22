import { Injectable } from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
import { Signature } from './entities/signature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SignaturesService {
  constructor(
    @InjectRepository(Signature)
    private readonly signatureRepository: Repository<Signature>,
  ) {}

  async signPetition(
    CreateSignatureDto: CreateSignatureDto,
  ): Promise<Signature> {
    const newSignature = new Signature();
    Object.assign(newSignature, CreateSignatureDto);
    newSignature.signatureDate = new Date();
    return await this.signatureRepository.save(newSignature);
  }
}
