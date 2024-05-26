import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Petition } from './petitions/entities/petition.entity';
import { Signature } from './signatures/entities/signature.entity';
import { PetitionsModule } from './petitions/petitions.module';
import { SignaturesModule } from './signatures/signatures.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env.petition.dev',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'petition-db',
      entities: [Petition, Signature],
      synchronize: true,
    }),
    PetitionsModule,
    SignaturesModule,
    ClientsModule.register([
      {
        name: 'ALERTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'notifications-queue',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
