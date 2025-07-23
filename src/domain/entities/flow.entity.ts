import { Name } from '../value-objects/name.vo';
import { Stage } from './stage.entity';

export class Flow {
  constructor(
    public readonly id: string,
    public name: Name,
    public description?: string,
    public stages: Stage[] = [],
  ) {}

  getName(): string {
    return this.name.getValue();
  }

  rename(newName: string): void {
    this.name = Name.create(newName);
  }

  updateDescription(desc?: string) {
    this.description = desc;
  }

  toPrimitive(): {
    id: string;
    name: string;
    description?: string;
    stages?: Stage[];
  } {
    return {
      id: this.id,
      name: this.name.getValue(),
      description: this.description,
      stages: this.stages,
    };
  }

  static fromPrimitive(data: {
    id: string;
    name: string;
    description?: string;
    stages?: Stage[];
  }): Flow {
    const flow = new Flow(
      data.id,
      Name.create(data.name),
      data.description,
      data.stages?.map((stage) => Stage.fromPrimitive(stage)) || [],
    );
    return flow;
  }
}
