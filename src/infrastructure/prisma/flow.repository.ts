import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FlowRepository } from '../../application/interfaces/flow-repository.interface';
import { Flow } from '../../domain/entities/flow.entity';
import { Stage } from '../../domain/entities/stage.entity';
import { StageType } from '../../domain/enums/stage-type.enum';

@Injectable()
export class FlowRepositoryImpl implements FlowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(flow: Flow): Promise<void> {
    await this.prisma.flow.create({
      data: {
        id: flow.id,
        name: flow.name,
        description: flow.description,
      },
    });
  }

  async findAll(): Promise<Flow[]> {
    const rows = await this.prisma.flow.findMany({
      include: { stages: true },
    });
    return rows.map(
      (r) =>
        new Flow(
          r.id,
          r.name,
          r.description ?? undefined,
          r.stages.map(
            (s) =>
              new Stage(
                s.id,
                s.flowId,
                s.order,
                s.stageType as StageType,
                (s.config as Record<string, any>) ?? {},
              ),
          ),
        ),
    );
  }

  async findById(id: string): Promise<Flow | null> {
    const r = await this.prisma.flow.findUnique({
      where: { id },
      include: { stages: true },
    });
    if (!r) return null;
    return new Flow(
      r.id,
      r.name,
      r.description ?? undefined,
      r.stages.map(
        (s) =>
          new Stage(
            s.id,
            s.flowId,
            s.order,
            s.stageType as StageType,
            (s.config as Record<string, any>) ?? {},
          ),
      ),
    );
  }

  async update(flow: Flow): Promise<void> {
    await this.prisma.flow.update({
      where: { id: flow.id },
      data: {
        name: flow.name,
        description: flow.description,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.flow.delete({ where: { id } });
  }
}
