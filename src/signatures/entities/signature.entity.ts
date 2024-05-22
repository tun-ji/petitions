import { Petition } from 'src/petitions/entities/petition.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Signature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  signatoryEmail: string;

  @Column()
  signatoryName: string;

  @Column()
  signatoryPhoneNumber: string;

  @Column()
  signatoryState: string;

  @Column()
  signatoryConstituency: string;

  @CreateDateColumn()
  signatureDate: Date;

  @Column()
  notify: boolean;

  @ManyToOne(() => Petition, (petition) => petition.signatures)
  petition: Petition;
}
