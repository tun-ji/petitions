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

@Controller('petitions')
export class PetitionsController {
  constructor(private readonly petitionsService: PetitionsService) {}

  @Post()
  async createPetition(
    @Body() createPetitionDto: CreatePetitionDto,
  ): Promise<Petition> {
    const newPetition =
      await this.petitionsService.createPetition(createPetitionDto);
    return newPetition;
  }

  @Get('/feed')
  async getPopularPetitions(@Query('limit') limit: number) {
    const petitionIds = await this.petitionsService.getPopularPetitions(limit);
    return petitionIds;
  }

  @Get(':slug')
  async getPetitionBySlug(@Param('slug') slug: string) {
    const petition = await this.petitionsService.getPetitionBySlug(slug);
    return petition;
  }

  @EventPattern('petition.opened')
  async openPetition(@Payload() petition: Petition) {
    return await this.petitionsService.openPetition(petition);
  }
}
