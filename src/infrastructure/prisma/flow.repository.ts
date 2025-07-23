import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FlowRepository } from '../../domain/interfaces/flow-repository.interface';
import { Flow } from '../../domain/entities/flow.entity';
import { Stage } from '../../domain/entities/stage.entity';
import { StageType } from '../../domain/enums/stage-type.enum';

@Injectable()
export class FlowRepositoryImpl implements FlowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(flow: Flow): Promise<void> {
    const { id, name, description } = flow.toPrimitive();
    await this.prisma.flow.create({
      data: {
        id,
        name,
        description,
      },
    });
  }

  async findAll(): Promise<Flow[]> {
    const rows = await this.prisma.flow.findMany({
      include: { stages: true },
    });
    return rows.map((r) => {
      const flow = Flow.fromPrimitive({
        ...r,
        description: r.description ?? undefined,
        stages: r.stages
          ? r.stages.map((s) =>
              Stage.fromPrimitive({
                ...s,
                stageType: s.stageType as StageType,
                config: (s.config as Record<string, any>) ?? {},
              }),
            )
          : [],
      });
      return flow;
    });
  }

  async findById(id: string): Promise<Flow | null> {
    const r = await this.prisma.flow.findUnique({
      where: { id },
      include: { stages: true },
    });
    if (!r) return null;
    return Flow.fromPrimitive({
      ...r,
      description: r.description ?? undefined,
      stages: r.stages
        ? r.stages.map((s) =>
            Stage.fromPrimitive({
              ...s,
              stageType: s.stageType as StageType,
              config: (s.config as Record<string, any>) ?? {},
            }),
          )
        : [],
    });
  }

  async update(flow: Flow): Promise<void> {
    const { name, description } = flow.toPrimitive();
    await this.prisma.flow.update({
      where: { id: flow.id },
      data: {
        name,
        description,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.flow.delete({ where: { id } });
  }
}
