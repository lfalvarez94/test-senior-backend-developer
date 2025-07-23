import { StageExecution } from '../entities/stage-execution.entity';

export interface StageExecutionRepository {
  createMany(execs: StageExecution[]): Promise<void>;
  findById(id: string): Promise<StageExecution | null>;
  update(exec: StageExecution): Promise<void>;
}
