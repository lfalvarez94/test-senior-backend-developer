import { Stage } from './stage.entity';

export class Flow {
  constructor(
    public readonly id: string,
    public name: string,
    public description?: string,
    public stages: Stage[] = [],
  ) {}

  rename(name: string) {
    if (!name) throw new Error('El nombre es obligatorio');
    this.name = name;
  }

  updateDescription(desc?: string) {
    this.description = desc;
  }
}
