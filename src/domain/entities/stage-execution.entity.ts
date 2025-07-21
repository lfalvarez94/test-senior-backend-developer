import { StageExecutionStatus } from '../enums/stage-execution-status.enum';

export class StageExecution {
  constructor(
    public readonly id: string,
    public readonly flowExecutionId: string,
    public readonly stageId: string,
    public status: StageExecutionStatus = StageExecutionStatus.PENDING,
    public readonly scheduledAt?: Date,
    public startedAt?: Date,
    public finishedAt?: Date,
    public errorMessage?: string,
  ) {}

  markInProgress() {
    this.status = StageExecutionStatus.IN_PROGRESS;
    this.startedAt = new Date();
  }

  markDone() {
    this.status = StageExecutionStatus.DONE;
    this.finishedAt = new Date();
  }

  markError(message: string) {
    this.status = StageExecutionStatus.ERROR;
    this.errorMessage = message;
    this.finishedAt = new Date();
  }
}
