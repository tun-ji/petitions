import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PetitionsService } from './petitions.service';
import { CreatePetitionDto } from './dto/create-petition.dto';
import { Petition } from './entities/petition.entity';

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

  @Get(':slug')
  async getPetitionBySlug(@Param('slug') slug: string) {
    const petition = await this.petitionsService.getPetitionBySlug(slug);
    return petition;
  }
}
