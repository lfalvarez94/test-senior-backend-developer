import { StageType } from '../../domain/enums/stage-type.enum';
import { IsEnum, IsInt, IsObject } from 'class-validator';

export class CreateStageDto {
  @IsInt()
  readonly order: number;

  @IsEnum(StageType)
  readonly stageType: StageType;

  @IsObject()
  readonly config: Record<string, any>;
}
