import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Solution Hub API está funcionando! 🚀\n\nAcesse /api/v1/info para mais informações sobre a API.\nAcesse /api/v1/health para verificar o status dos módulos.';
  }
}
