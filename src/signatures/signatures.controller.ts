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
import { SignaturesService } from './signatures.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) {}

  @Get('visualize')
  async visualize(@Query('petitionSlug') petitionSlug: string) {
    const petition =
      await this.signaturesService.getPetitionSupportByState(petitionSlug);
    return petition;
  }

  @Post('sign')
  async create(@Body() createSignatureDto: CreateSignatureDto) {
    return await this.signaturesService.signPetition(createSignatureDto);
  }
}
