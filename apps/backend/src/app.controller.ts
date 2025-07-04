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
        marketIntelligence: 'active', // ✅ Agora ativo com integração PNCP
        opportunities: 'active',
        notifications: 'active',
        financial: 'pending',
        documents: 'pending',
        analytics: 'pending',
        productivity: 'pending',
      },
      integrations: {
        pncp: 'active', // ✅ Integração PNCP funcionando
        database: 'active',
        scheduler: 'active'
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
        marketIntelligence: '/api/v1/market-intelligence',
        opportunities: '/api/v1/opportunities',
        notifications: '/api/v1/notifications',
        health: '/api/v1/health',
      },
      features: {
        pncpIntegration: 'Integração automática com Portal Nacional de Contratações Públicas',
        automatedPolling: 'Coleta automatizada de licitações a cada 30 minutos',
        opportunityDetection: 'Detecção inteligente de oportunidades relevantes',
        marketAnalytics: 'Análises avançadas de mercado e tendências'
      }
    };
  }
}
