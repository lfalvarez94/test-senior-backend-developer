import { Injectable, Inject } from '@nestjs/common';
import { FlowRepository } from '../../domain/interfaces/flow-repository.interface';
import { CreateFlowDto } from '../dtos/create-flow.dto';
import { Flow } from '../../domain/entities/flow.entity';
import { Name } from '../../domain/value-objects/name.vo';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CreateFlowUseCase {
  constructor(
    @Inject('FlowRepository') private readonly repo: FlowRepository,
  ) {}

  async execute(dto: CreateFlowDto): Promise<string> {
    const id = uuid();
    const name = Name.create(dto.name);
    const flow = new Flow(id, name, dto.description);
    await this.repo.create(flow);
    return id;
  }
}
