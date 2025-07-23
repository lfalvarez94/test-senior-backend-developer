import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateStageDto } from '../dtos/create-stage.dto';
import { StageRepository } from '../../domain/interfaces/stage-repository.interface';
import { Stage } from '../../domain/entities/stage.entity';
import { StageType } from 'src/domain/enums/stage-type.enum';

@Injectable()
export class CreateStageUseCase {
  constructor(
    @Inject('StageRepository') private readonly repo: StageRepository,
  ) {}

  async execute(flowId: string, dto: CreateStageDto): Promise<string> {
    const existingStages = await this.repo.findByFlow(flowId);
    if (existingStages.some((s) => s.order === dto.order)) {
      throw new Error(
        `La etapa con orden ${dto.order} ya existe en el flow ${flowId}`,
      );
    }
    if (dto.stageType === StageType.EMAIL) {
      const hasFormWithEmail = existingStages.some(
        (s) =>
          s.stageType === StageType.POPUP_FORM &&
          Array.isArray(s.config.fields) &&
          s.config.fields.some((f: any) => f.name === 'email'),
      );
      if (!hasFormWithEmail) {
        throw new Error(
          'Para usar EMAIL debe existir previamente un POPUP_FORM con campo email',
        );
      }
    }

    const id = uuid();
    const stage = new Stage(id, flowId, dto.order, dto.stageType, dto.config);
    await this.repo.create(stage);
    return id;
  }
}
