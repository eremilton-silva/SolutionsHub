import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      service: 'Solution Hub API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      modules: {
        auth: 'active',
        crm: 'active',
        marketIntelligence: 'pending',
        opportunities: 'pending',
        notifications: 'pending',
        financial: 'pending',
        documents: 'pending',
        analytics: 'pending',
        productivity: 'pending',
      }
    };
  }

  @Get('info')
  getInfo() {
    return {
      name: 'Solution Hub API',
      description: 'Sistema SaaS completo para gestão de licitações',
      version: '1.0.0',
      company: 'Solution Assessoria em Licitações',
      documentation: '/api/v1/docs',
      endpoints: {
        auth: '/api/v1/auth',
        crm: '/api/v1/crm',
        health: '/api/v1/health',
      }
    };
  }
}
