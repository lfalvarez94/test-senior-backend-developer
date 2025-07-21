import { Injectable, Inject } from '@nestjs/common';
import { FlowRepository } from '../interfaces/flow-repository.interface';
import { Flow } from '../../domain/entities/flow.entity';

@Injectable()
export class ListFlowsUseCase {
  constructor(
    @Inject('FlowRepository') private readonly repo: FlowRepository,
  ) {}

  async execute(): Promise<Flow[]> {
    return this.repo.findAll();
  }
}
