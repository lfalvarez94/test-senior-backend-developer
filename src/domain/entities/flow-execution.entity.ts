import { FlowExecutionStatus } from '../enums/flow-execution-status.enum';

export class FlowExecution {
  constructor(
    public readonly id: string,
    public readonly flowId: string,
    public readonly userId?: string,
    public status: FlowExecutionStatus = FlowExecutionStatus.PENDING,
    public readonly startedAt: Date = new Date(),
    public finishedAt?: Date,
  ) {}

  markRunning() {
    this.status = FlowExecutionStatus.RUNNING;
  }

  markCompleted() {
    this.status = FlowExecutionStatus.COMPLETED;
    this.finishedAt = new Date();
  }

  markFailed() {
    this.status = FlowExecutionStatus.FAILED;
    this.finishedAt = new Date();
  }
}
