import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FlowExecutionRepository } from '../../domain/interfaces/flow-execution-repository.interface';
import { FlowExecutionStatus } from '../../domain/enums/flow-execution-status.enum';
import { FlowExecution } from '../../domain/entities/flow-execution.entity';

@Injectable()
export class FlowExecutionRepositoryImpl implements FlowExecutionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(exec: FlowExecution): Promise<void> {
    await this.prisma.flowExecution.create({
      data: {
        id: exec.id,
        flowId: exec.flowId,
        userId: exec.userId,
        status: exec.status,
        startedAt: exec.startedAt,
      },
    });
  }
}
