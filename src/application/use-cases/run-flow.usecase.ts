import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { FlowRepository } from '../interfaces/flow-repository.interface';
import { FlowExecutionRepository } from '../interfaces/flow-execution-repository.interface';
import { StageExecutionRepository } from '../interfaces/stage-execution-repository.interface';
import { MessagingService } from '../interfaces/messaging.interface';
import { ConfigService } from '@nestjs/config';
import { FlowExecution } from '../../domain/entities/flow-execution.entity';
import { StageExecution } from '../../domain/entities/stage-execution.entity';
import { StageExecutionStatus } from '../../domain/enums/stage-execution-status.enum';
import { StageType } from 'src/domain/enums/stage-type.enum';

@Injectable()
export class RunFlowUseCase {
  constructor(
    @Inject('FlowRepository') private readonly flowRepo: FlowRepository,
    @Inject('FlowExecutionRepository')
    private readonly execRepo: FlowExecutionRepository,
    @Inject('StageExecutionRepository')
    private readonly stageExecRepo: StageExecutionRepository,
    @Inject('MessagingService') private readonly messaging: MessagingService,
    private readonly configService: ConfigService,
  ) {}

  async execute(flowId: string, userId?: string): Promise<string> {
    const flow = await this.flowRepo.findById(flowId);
    if (!flow) throw new Error(`Flow ${flowId} no encontrado`);

    const execId = uuid();
    const flowExec = new FlowExecution(execId, flowId, userId);
    flowExec.markRunning();
    await this.execRepo.create(flowExec);

    const stageExecs: StageExecution[] = flow.stages
      .sort((a, b) => a.order - b.order)
      .map(
        (stage) =>
          new StageExecution(
            uuid(),
            execId,
            stage.id,
            StageExecutionStatus.PENDING,
            stage.stageType === StageType.DELAY
              ? new Date(Date.now() + stage.config.timeout * 1000)
              : undefined,
          ),
      );
    await this.stageExecRepo.createMany(stageExecs);

    const first = stageExecs[0];
    const topicArn = this.configService.get<string>('SNS_STAGE_READY_ARN');
    if (!topicArn) {
      throw new Error('SNS_STAGE_READY_ARN is not defined in configuration');
    }
    await this.messaging.publish(topicArn, { stageExecutionId: first.id });

    return execId;
  }
}
