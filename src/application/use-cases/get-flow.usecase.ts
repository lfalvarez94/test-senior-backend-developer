import { Injectable, Inject } from '@nestjs/common';
import { FlowRepository } from '../interfaces/flow-repository.interface';
import { Flow } from '../../domain/entities/flow.entity';

@Injectable()
export class GetFlowUseCase {
  constructor(
    @Inject('FlowRepository') private readonly repo: FlowRepository,
  ) {}

  async execute(id: string): Promise<Flow | null> {
    return this.repo.findById(id);
  }
}
