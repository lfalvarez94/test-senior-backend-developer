import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { StageRepository } from '../../domain/interfaces/stage-repository.interface';
import { Stage } from '../../domain/entities/stage.entity';
import { StageType } from '../../domain/enums/stage-type.enum';

@Injectable()
export class StageRepositoryImpl implements StageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(stage: Stage): Promise<void> {
    await this.prisma.stage.create({
      data: {
        id: stage.id,
        flowId: stage.flowId,
        order: stage.order,
        stageType: stage.stageType,
        config: stage.config,
      },
    });
  }

  async findByFlow(flowId: string): Promise<Stage[]> {
    const rows = await this.prisma.stage.findMany({
      where: { flowId: flowId },
      orderBy: { order: 'asc' },
    });
    return rows.map(
      (r) =>
        new Stage(
          r.id,
          r.flowId,
          r.order,
          r.stageType as StageType,
          (r.config as Record<string, any>) ?? {},
        ),
    );
  }

  async findById(id: string): Promise<Stage | null> {
    const r = await this.prisma.stage.findUnique({ where: { id } });
    if (!r) return null;
    return new Stage(
      r.id,
      r.flowId,
      r.order,
      r.stageType as StageType,
      (r.config as Record<string, any>) ?? {},
    );
  }

  async update(stage: Stage): Promise<void> {
    await this.prisma.stage.update({
      where: { id: stage.id },
      data: {
        order: stage.order,
        config: stage.config,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.stage.delete({ where: { id } });
  }
}
