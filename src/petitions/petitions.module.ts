import { Module } from '@nestjs/common';
import { PetitionsService } from './petitions.service';
import { PetitionsController } from './petitions.controller';
import { Petition } from './entities/petition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignaturesModule } from 'src/signatures/signatures.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Petition]),
    SignaturesModule,
    ClientsModule.register([
      {
        name: 'ALERTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'notifications-queue',
        },
      },
    ]),
  ],
  controllers: [PetitionsController],
  providers: [PetitionsService],
})
export class PetitionsModule {}
