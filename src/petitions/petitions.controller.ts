import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PetitionsService } from './petitions.service';
import { CreatePetitionDto } from './dto/create-petition.dto';
import { Petition } from './entities/petition.entity';
import { EventPattern, Payload } from '@nestjs/microservices';
import { generateRequestId, makeServiceFailure, makeServiceSuccess } from 'src/utils/serviceResp.utils';

@Controller('petitions')
export class PetitionsController {
  constructor(private readonly petitionsService: PetitionsService) {}

  @Post()
  async createPetition(
    @Body() createPetitionDto: CreatePetitionDto,
  ): Promise<any> {
    let newPetition
    const responseID = generateRequestId() + '-C'

    try {
      newPetition =
        await this.petitionsService.createPetition(createPetitionDto);
      
      return makeServiceSuccess(responseID, 'CreatePetitionController', newPetition)
    } catch (error) {
      return makeServiceFailure(responseID, 'CreatePetitionController', error.name, error.message)
    }
  }

  @Get('/feed')
  async getPopularPetitions(@Query('limit') limit: number) {
    const petitionIds = await this.petitionsService.getPopularPetitions(limit);
    return petitionIds;
  }

  @Get(':slug')
  async getPetitionBySlug(@Param('slug') slug: string) {
    let retrievedPetition
    const responseID = generateRequestId() + '-C'    
    
    try {
      retrievedPetition = await this.petitionsService.getPetitionBySlug(slug);
      return makeServiceSuccess(responseID, 'GetPetitionBySlugController', retrievedPetition)
    } catch (error) {
      return makeServiceFailure(responseID, 'GetPetitionBySlugController', error.name, error.message)
    }
  }

  @EventPattern('petition.opened')
  async openPetition(@Payload() petition: Petition) {
    return await this.petitionsService.openPetition(petition);
  }
}
