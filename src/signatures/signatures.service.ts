import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
import { Signature } from './entities/signature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetitionsService } from 'src/petitions/petitions.service';
import { Petition } from 'src/petitions/entities/petition.entity';
import { CreatePetitionDto } from 'src/petitions/dto/create-petition.dto';

@Injectable()
export class SignaturesService {
  constructor(
    @InjectRepository(Signature)
    private readonly signatureRepository: Repository<Signature>,
    @InjectRepository(Petition)
    private readonly petitionRepository: Repository<Petition>,
  ) {}

  async getPetitionBySlug(slug: string): Promise<Petition> {
    let petition;

    try {
      petition = await this.petitionRepository.findOne({ where: { slug } });
    } catch (error) {
      return error;
    }

    if (!petition) {
      throw new HttpException(
        'This petition does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return petition;
  }

  async signPetition(
    CreateSignatureDto: CreateSignatureDto,
  ): Promise<Signature> {
    // Retrieve the Petition By It's Slug
    let petition = await this.getPetitionBySlug(
      CreateSignatureDto.petitionSlug,
    );
    const newSignature = new Signature();
    Object.assign(newSignature, CreateSignatureDto);
    newSignature.petition = petition;
    newSignature.signatureDate = new Date();
    return await this.signatureRepository.save(newSignature);
  }
}
