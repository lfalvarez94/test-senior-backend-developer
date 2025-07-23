import { FlowExecution } from '../entities/flow-execution.entity';

export interface FlowExecutionRepository {
  create(exec: FlowExecution): Promise<void>;
}
