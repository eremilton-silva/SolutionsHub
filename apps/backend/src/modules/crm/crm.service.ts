import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Client, ClientStatus, ClientType } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FindClientsDto } from './dto/find-clients.dto';

@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async findAll(findClientsDto: FindClientsDto = {}) {
    const { page = 1, limit = 10, search, status, type, assignedUserId } = findClientsDto;
    
    const where: FindOptionsWhere<Client> = {};
    
    if (search) {
      where.name = Like(`%${search}%`);
    }
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (assignedUserId) {
      where.assignedUserId = assignedUserId;
    }

    const [clients, total] = await this.clientRepository.findAndCount({
      where,
      relations: ['assignedUser'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: clients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['assignedUser'],
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    
    Object.assign(client, updateClientDto);
    
    return this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }

  async updateLastContact(id: string): Promise<Client> {
    const client = await this.findOne(id);
    client.lastContactDate = new Date();
    return this.clientRepository.save(client);
  }

  async getClientStats() {
    const [
      total,
      active,
      prospects,
      inactive,
      companies,
      individuals,
      government,
    ] = await Promise.all([
      this.clientRepository.count(),
      this.clientRepository.count({ where: { status: ClientStatus.ACTIVE } }),
      this.clientRepository.count({ where: { status: ClientStatus.PROSPECT } }),
      this.clientRepository.count({ where: { status: ClientStatus.INACTIVE } }),
      this.clientRepository.count({ where: { type: ClientType.COMPANY } }),
      this.clientRepository.count({ where: { type: ClientType.INDIVIDUAL } }),
      this.clientRepository.count({ where: { type: ClientType.GOVERNMENT } }),
    ]);

    return {
      total,
      byStatus: {
        active,
        prospects,
        inactive,
        blocked: total - active - prospects - inactive,
      },
      byType: {
        companies,
        individuals,
        government,
      },
    };
  }
}
