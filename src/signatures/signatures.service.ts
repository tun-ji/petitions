import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { Signature } from './entities/signature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Petition } from 'src/petitions/entities/petition.entity';
import { FeatureCollection, Feature } from 'geojson';
import * as fs from 'fs';

const nigeriaStateGeoJSONPath = 'src/signatures/util/nigeria_geojson.geojson';
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
    // TODO: Make the email unique per signature for petition
    let petition = await this.getPetitionBySlug(
      CreateSignatureDto.petitionSlug,
    );
    const newSignature = new Signature();
    Object.assign(newSignature, CreateSignatureDto);
    newSignature.petition = petition;
    newSignature.signatureDate = new Date();
    return await this.signatureRepository.save(newSignature);
  }

  async getPetitionSupportByState(
    petitionSlug: string,
  ): Promise<FeatureCollection<any>> {
    const nigeriaStateGeoJSON = JSON.parse(
      fs.readFileSync(nigeriaStateGeoJSONPath, 'utf8'),
    );
    const petition = await this.getPetitionBySlug(petitionSlug);
    const petitionId = petition.id;
    const query = await this.signatureRepository
      .createQueryBuilder('signature')
      .select('signature.signatoryState AS state_name')
      .addSelect('COUNT(*) AS signature_count')
      .where('signature.petitionId = :petitionId', { petitionId })
      .groupBy('signature.signatoryState')
      .getRawMany();

    const features = [];

    for (let row of query) {
      let feature = this.createFeatureFromState(
        row.state_name,
        row.signature_count,
        nigeriaStateGeoJSON,
      );

      if (feature != null) {
        features.push(feature);
      }
    }

    return {
      type: 'FeatureCollection',
      features,
    };
  }

  private createFeatureFromState(
    stateName: string,
    signatureCount: number,
    geoJSONData: FeatureCollection<any>,
  ): Feature<any> {
    const matchingFeature = geoJSONData.features.find(
      (feature) => feature.properties.state == stateName,
    );
    // console.log(geoJSONData.features[0]);
    if (matchingFeature) {
      return {
        type: 'Feature',
        geometry: matchingFeature.geometry,
        properties: {
          signatureCount,
          state: matchingFeature.properties.state,
        },
      };
    } else {
      console.warn(`State "${stateName}" not found in Nigeria GeoJSON data.`);
    }
    return;
  }
}
