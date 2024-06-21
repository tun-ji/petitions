import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { CorsMiddleware } from './middleware/cors.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const petitionMS = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:rabbitmq@petitions-rabbitmq:5672'],
      queue: 'petition-queue',
    },
  });
  await app.startAllMicroservices();
  const PORT = process.env.port || 10000
  const HOST = '0.0.0.0'
  await app.listen(PORT, HOST, () => {
    `Server listening on Port ${PORT}, hostname: ${HOST}`
  });
}
bootstrap();
