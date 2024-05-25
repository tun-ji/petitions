import { Petition } from 'src/petitions/entities/petition.entity';

export class CreateSignatureDto {
  signatoryName: string;
  signatoryEmail: string;
  signatoryPhoneNumber: string;
  signatoryState: string;
  signatoryConstituency: string;
  notify: boolean;
  petitionSlug: string;
}
