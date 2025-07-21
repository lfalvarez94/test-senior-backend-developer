import { Injectable, Inject } from '@nestjs/common';
import { UpdateFlowDto } from '../dtos/update-flow.dto';
import { FlowRepository } from '../interfaces/flow-repository.interface';
import { Flow } from '../../domain/entities/flow.entity';

@Injectable()
export class UpdateFlowUseCase {
  constructor(
    @Inject('FlowRepository') private readonly repo: FlowRepository,
  ) {}

  async execute(id: string, dto: UpdateFlowDto): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error('Flow no encontrado');
    if (dto.name) existing.rename(dto.name);
    if (dto.description !== undefined)
      existing.updateDescription(dto.description);
    await this.repo.update(existing);
  }
}
