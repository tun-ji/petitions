import { Module } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { SignaturesController } from './signatures.controller';
import { Signature } from './entities/signature.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetitionsModule } from 'src/petitions/petitions.module';
import { Petition } from 'src/petitions/entities/petition.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Signature, Petition]),
    ClientsModule.register([
      {
        name: 'ALERTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:rabbitmq@petitions-rabbitmq:5672'],
          queue: 'petition-queue',
        },
      },
    ]),
  ],
  controllers: [SignaturesController],
  providers: [SignaturesService],
  exports: [SignaturesService],
})
export class SignaturesModule {}
