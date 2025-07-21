import { Injectable, Inject } from '@nestjs/common';
import { FlowRepository } from '../interfaces/flow-repository.interface';
import { CreateFlowDto } from '../dtos/create-flow.dto';
import { Flow } from '../../domain/entities/flow.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CreateFlowUseCase {
  constructor(
    @Inject('FlowRepository') private readonly repo: FlowRepository,
  ) {}

  async execute(dto: CreateFlowDto): Promise<string> {
    const id = uuid();
    const flow = new Flow(id, dto.name, dto.description);
    await this.repo.create(flow);
    return id;
  }
}
