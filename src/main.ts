import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { CorsMiddleware } from './middleware/cors.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const petitionMS = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@petitions-rabbitmq.onrender.com:5672'],
      queue: 'petition-queue',
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
