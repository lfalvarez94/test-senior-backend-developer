import { StageType } from '../enums/stage-type.enum';

export class Stage {
  constructor(
    public readonly id: string,
    public readonly flowId: string,
    public order: number,
    public stageType: StageType,
    public config: Record<string, any>,
  ) {}
}
