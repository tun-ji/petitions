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
import { CorsMiddleware } from './middleware/cors.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT as unknown as number,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Petition, Signature],
      synchronize: true,
    }),
    PetitionsModule,
    SignaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService, CorsMiddleware],
})
export class AppModule {
  configure(config: any) {
    return {
      ...config,
      globalMiddleware: [CorsMiddleware],
    };
  }
}
