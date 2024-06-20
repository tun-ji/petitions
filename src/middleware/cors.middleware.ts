import { Injectable, NestMiddleware } from '@nestjs/common';
import * as cors from 'cors';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: Function) {
    const options = {
      origin: '*', 
      methods: 'GET, POST, PUT, DELETE, OPTIONS',
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
    res.options(origin, cors(options)); // For OPTIONS requests
    res.header('Access-Control-Allow-Origin', options.origin);
    res.header('Access-Control-Allow-Methods', options.methods);
    res.header('Access-Control-Allow-Headers', options.allowedHeaders);
    next();
  }
}
