import { Module, forwardRef } from '@nestjs/common';
import { FlowController } from './flow.controller';
import { PrismaService } from 'nestjs-prisma';
import { FlowRepositoryImpl } from '../../../infrastructure/prisma/flow.repository';
import { CreateFlowUseCase } from '../../../application/use-cases/create-flow.usecase';
import { ListFlowsUseCase } from '../../../application/use-cases/list-flows.usecase';
import { GetFlowUseCase } from '../../../application/use-cases/get-flow.usecase';
import { UpdateFlowUseCase } from '../../../application/use-cases/update-flow.usecase';
import { DeleteFlowUseCase } from '../../../application/use-cases/delete-flow.usecase';
import { OrchestratorModule } from '../orchestrator/orchestrator.module';

@Module({
  imports: [forwardRef(() => OrchestratorModule)],
  controllers: [FlowController],
  providers: [
    PrismaService,
    { provide: 'FlowRepository', useClass: FlowRepositoryImpl },
    CreateFlowUseCase,
    ListFlowsUseCase,
    GetFlowUseCase,
    UpdateFlowUseCase,
    DeleteFlowUseCase,
  ],
  exports: ['FlowRepository'],
})
export class FlowModule {}
