import { Signature } from 'src/signatures/entities/signature.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class Petition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  name: string;

  // @Column('text')
  // summary: string;

  @Column('text')
  fullText: string;

  @Column({ type: 'text', nullable: true })
  status: string;

  @Column('text')
  creatorName: string;

  @Column('text')
  creatorEmail: string;

  @Column('timestamp')
  deadline: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  openedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column('bool')
  isOpen: boolean;

  @Column('bool')
  isVisible: boolean;

  // TODO: Make a relationship between the Petition and Bill
  @Column({ type: 'int', nullable: true })
  billId: number;

  @OneToMany(() => Signature, (signature) => signature.petition, {
    eager: false,
  })
  signatures: Signature[];

  @Column({ type: 'text', nullable: true })
  govtResponse: string;

  @BeforeUpdate()
  updateTimestamp() {
    this.lastUpdatedAt = new Date();
  }
}
