import { Injectable, Inject } from '@nestjs/common';
import { StageRepository } from '../interfaces/stage-repository.interface';
import { Stage } from '../../domain/entities/stage.entity';

@Injectable()
export class ListStagesUseCase {
  constructor(
    @Inject('StageRepository') private readonly repo: StageRepository,
  ) {}

  async execute(flowId: string): Promise<Stage[]> {
    return this.repo.findByFlow(flowId);
  }
}
