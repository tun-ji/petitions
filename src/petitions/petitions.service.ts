import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreatePetitionDto } from './dto/create-petition.dto';
import { UpdatePetitionDto } from './dto/update-petition.dto';
import { Petition } from './entities/petition.entity';
import { getRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { SignaturesService } from 'src/signatures/signatures.service';
import { CreateSignatureDto } from 'src/signatures/dto/create-signature.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PetitionsService {
  constructor(
    @Inject(forwardRef(() => SignaturesService))
    private signatureService: SignaturesService,
    @InjectRepository(Petition)
    private readonly petitionRepository: Repository<Petition>,
    @Inject('ALERTS_SERVICE')
    private rabbitClient: ClientProxy,
  ) {}

  private slugMaker(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  /**
   *
   * @param {number} months Desired number of months into the future
   * @returns {Date} Date in specified number of months from current date
   */
  private getFutureDate(months: number = 3): Date {
    const currDate = new Date();
    currDate.setMonth(currDate.getMonth() + months);
    return currDate;
  }

  async createPetition(
    createPetitionDto: CreatePetitionDto,
  ): Promise<Petition> {
    console.log(createPetitionDto);
    // Create a Petition
    let newPetition = new Petition();
    Object.assign(newPetition, createPetitionDto.petition);

    Object.assign(newPetition, createPetitionDto.creator);
    newPetition.slug = this.slugMaker(createPetitionDto.petition.name);
    newPetition.deadline = this.getFutureDate();
    newPetition.isOpen = false;
    newPetition.isVisible = false;

    newPetition = await this.petitionRepository.save(newPetition);

    let createSignatureDto: CreateSignatureDto = {
      petitionSlug: newPetition.slug,
      signatoryName: createPetitionDto.creator.creatorName,
      signatoryEmail: createPetitionDto.creator.creatorEmail,
      signatoryPhoneNumber: createPetitionDto.creator.creatorPhoneNumber,
      signatoryState: createPetitionDto.creator.creatorState,
      notify: createPetitionDto.creator.notify,
      signatoryConstituency: createPetitionDto.creator.creatorConstituency,
    };
    const newSignature =
      await this.signatureService.signPetition(createSignatureDto);

    await this.rabbitClient.emit('petition-created', newPetition);
    // Sign the Petition With the User
    return this.petitionRepository.save({
      id: newPetition.id,
      signature: [newSignature],
    });
  }

  /**
   *
   * @param {string} slug Unique slug identifying a petition
   * @returns {Promise<Petition>} Full Petition object
   */
  async getPetitionBySlug(slug: string): Promise<any> {
    let petition;

    try {
      petition = await this.petitionRepository.findOne({
        where: { slug },
        relations: { signatures: true },
      });
    } catch (error) {
      return error;
    }

    if (!petition) {
      throw new HttpException(
        'This petition does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    let signatureCount = petition.signatures.length;
    delete petition['signatures'];
    delete petition['creatorEmail'];

    return { ...petition, signatureCount };
  }

  async getPetitions(): Promise<any> {
    return await this.petitionRepository.find({
      where: {
        isOpen: true,
      },
      select: {
        signatures: false,
      },
    });
  }

  async signPetitionNotification(petition): Promise<any> {
    await this.rabbitClient.emit('petition-signed', petition); 
    return
  }

  async closePetition(slug: string): Promise<any> {
    let petition;

    try {
      petition = await this.getPetitionBySlug(slug);
    } catch (error) {
      return error;
    }

    // Mark the petition as closed
  }

  async getPopularPetitions(limit: number = 5): Promise<Petition[]> {
    // Check for petitions with the highest number of signatures in the during the day. Limit it to 5 results
    const current = new Date();
    const oneDayAgo = new Date(current.getTime() - 60 * 1440 * 1000);

    const query = await this.petitionRepository
      .createQueryBuilder('petition')
      .select('petition.id')
      .innerJoin('petition.signatures', 'signature')
      .where('signature.signatureDate >= :oneDayAgo', { oneDayAgo })
      .andWhere('signature.signatureDate < :current', { current })
      .andWhere('petition.isOpen = true')
      .groupBy('petition.id')
      .orderBy('count(signature.id)', 'DESC')
      .limit(limit)
      .getMany();

    let petitions: any = []; // query.forEach(async (petition) => await this.petitionRepository.findOne({where: {id: petition.id}}));
    for (let petition of query) {
      let retrievedPetition = await this.petitionRepository.findOne({
        select: {
          id: true,
          name: true,
          slug: true,
          signatures: true,
        },
        where: { id: petition.id },
        relations: { signatures: true }, // loadEagerRelations: false,
      });

      let signatureCount =
        await this.signatureService.getPopularPetitionSignatureCount(
          petition.id,
          current,
          oneDayAgo,
        );

      Object.assign(retrievedPetition, { signatureCount });

      delete retrievedPetition['signatures'];

      petitions.push(retrievedPetition);
    }

    return petitions;
  }

  async openPetition(petition: Petition) {
    console.log(`OPENING PETITION ${petition.slug}`);
    return await this.petitionRepository.save({
      id: petition.id,
      ...petition,
    });
  }
}
