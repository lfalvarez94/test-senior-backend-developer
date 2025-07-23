import { StageType } from '../enums/stage-type.enum';

export class Stage {
  constructor(
    public readonly id: string,
    public readonly flowId: string,
    public order: number,
    public stageType: StageType,
    public config: Record<string, any>,
  ) {}

  toPrimitive(): {
    id: string;
    flowId: string;
    order: number;
    stageType: StageType;
    config: Record<string, any>;
  } {
    return {
      id: this.id,
      flowId: this.flowId,
      order: this.order,
      stageType: this.stageType,
      config: this.config,
    };
  }

  static fromPrimitive(data: {
    id: string;
    flowId: string;
    order: number;
    stageType: StageType;
    config: Record<string, any>;
  }): Stage {
    return new Stage(
      data.id,
      data.flowId,
      data.order,
      data.stageType,
      data.config,
    );
  }
}
