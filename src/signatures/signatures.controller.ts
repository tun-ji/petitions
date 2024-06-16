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
import {
  generateRequestId,
  makeServiceFailure,
  makeServiceSuccess,
} from 'src/utils/serviceResp.utils';

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
    const responseID = generateRequestId() + '-C';
    let newSignature;
    try {
      newSignature =
        await this.signaturesService.signPetition(createSignatureDto);
      return makeServiceSuccess(
        responseID,
        'SignPetitionController',
        newSignature,
      );
    } catch (error) {
      return makeServiceFailure(
        responseID,
        'SignPetitionController',
        error.name,
        error.message,
      );
    }
  }
}
