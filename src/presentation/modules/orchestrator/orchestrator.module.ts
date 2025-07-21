import { forwardRef, Module } from '@nestjs/common';
import { RunFlowUseCase } from '../../../application/use-cases/run-flow.usecase';
import { FlowExecutionRepositoryImpl } from '../../../infrastructure/prisma/flow-execution.repository';
import { StageExecutionRepositoryImpl } from '../../../infrastructure/prisma/stage-execution.repository';
import { SnsService } from '../../../infrastructure/messaging/sns.service';
import { PrismaService } from 'nestjs-prisma';
import { FlowModule } from '../flow/flow.module';
import { StageModule } from '../stage/stage.module';

@Module({
  imports: [forwardRef(() => FlowModule), forwardRef(() => StageModule)],
  providers: [
    PrismaService,
    {
      provide: 'FlowExecutionRepository',
      useClass: FlowExecutionRepositoryImpl,
    },
    {
      provide: 'StageExecutionRepository',
      useClass: StageExecutionRepositoryImpl,
    },
    { provide: 'MessagingService', useClass: SnsService },
    RunFlowUseCase,
  ],
  exports: [RunFlowUseCase],
})
export class OrchestratorModule {}
