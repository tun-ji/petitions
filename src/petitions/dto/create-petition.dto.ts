export class CreatePetitionDto {
  petition: {
    readonly name: string;
    readonly summary: string;
    readonly fullText: string;
  };
  creator: {
    readonly creatorName: string;
    readonly creatorEmail: string;
    readonly creatorPhoneNumber: string;
    readonly creatorState: string;
    readonly creatorConstituency: string;
    readonly notify: boolean;
  };
}
