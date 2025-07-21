import { StageType } from '../../domain/enums/stage-type.enum';
import { IsEnum, IsInt, IsObject } from 'class-validator';

export class CreateStageDto {
  readonly order: number;
  readonly stageType: StageType;
  readonly config: Record<string, any>;
}
