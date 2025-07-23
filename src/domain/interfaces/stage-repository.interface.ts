import { Stage } from '../entities/stage.entity';

export interface StageRepository {
  create(stage: Stage): Promise<void>;
  findByFlow(flowId: string): Promise<Stage[]>;
  findById(id: string): Promise<Stage | null>;
  update(stage: Stage): Promise<void>;
  delete(id: string): Promise<void>;
}
