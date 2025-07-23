import { Injectable, Inject } from '@nestjs/common';
import { FlowRepository } from '../../domain/interfaces/flow-repository.interface';

@Injectable()
export class DeleteFlowUseCase {
  constructor(
    @Inject('FlowRepository') private readonly repo: FlowRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
