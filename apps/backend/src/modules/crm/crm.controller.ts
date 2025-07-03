import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  Request
} from '@nestjs/common';
import { CrmService } from './crm.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FindClientsDto } from './dto/find-clients.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('crm')
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post('clients')
  create(@Body() createClientDto: CreateClientDto, @Request() req) {
    // Se não foi especificado um usuário responsável, usar o usuário logado
    if (!createClientDto.assignedUserId) {
      createClientDto.assignedUserId = req.user.id;
    }
    return this.crmService.create(createClientDto);
  }

  @Get('clients')
  findAll(@Query() findClientsDto: FindClientsDto) {
    return this.crmService.findAll(findClientsDto);
  }

  @Get('clients/stats')
  getStats() {
    return this.crmService.getClientStats();
  }

  @Get('clients/:id')
  findOne(@Param('id') id: string) {
    return this.crmService.findOne(id);
  }

  @Patch('clients/:id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.crmService.update(id, updateClientDto);
  }

  @Delete('clients/:id')
  remove(@Param('id') id: string) {
    return this.crmService.remove(id);
  }

  @Patch('clients/:id/contact')
  updateLastContact(@Param('id') id: string) {
    return this.crmService.updateLastContact(id);
  }

  @Get('health')
  health() {
    return { status: 'OK', service: 'Solution Hub CRM Service' };
  }
}
