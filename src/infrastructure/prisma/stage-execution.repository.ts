import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { StageExecutionRepository } from '../../application/interfaces/stage-execution-repository.interface';
import { StageExecution } from '../../domain/entities/stage-execution.entity';
import { StageExecutionStatus } from '../../domain/enums/stage-execution-status.enum';

@Injectable()
export class StageExecutionRepositoryImpl implements StageExecutionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(execs: StageExecution[]): Promise<void> {
    await this.prisma.stageExecution.createMany({
      data: execs.map((e) => ({
        id: e.id,
        flowExecutionId: e.flowExecutionId,
        stageId: e.stageId,
        status: e.status,
        scheduledAt: e.scheduledAt,
      })),
    });
  }

  async findById(id: string): Promise<StageExecution | null> {
    const r = await this.prisma.stageExecution.findUnique({ where: { id } });
    if (!r) return null;
    const exec = new StageExecution(
      r.id,
      r.flowExecutionId,
      r.stageId,
      r.status as StageExecutionStatus,
      r.scheduledAt ?? undefined,
      r.startedAt ?? undefined,
      r.finishedAt ?? undefined,
      r.errorMessage ?? undefined,
    );
    return exec;
  }

  async update(exec: StageExecution): Promise<void> {
    await this.prisma.stageExecution.update({
      where: { id: exec.id },
      data: {
        status: exec.status,
        startedAt: exec.startedAt,
        finishedAt: exec.finishedAt,
        errorMessage: exec.errorMessage,
      },
    });
  }
}
