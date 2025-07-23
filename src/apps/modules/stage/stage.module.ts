import { Module } from '@nestjs/common';
import { StageController } from './stage.controller';
import { CreateStageUseCase } from '../../../application/use-cases/create-stage.usecase';
import { ListStagesUseCase } from '../../../application/use-cases/list-stages.usecase';
import { StageRepositoryImpl } from '../../../infrastructure/prisma/stage.repository';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [StageController],
  providers: [
    PrismaService,
    { provide: 'StageRepository', useClass: StageRepositoryImpl },
    CreateStageUseCase,
    ListStagesUseCase,
  ],
  exports: ['StageRepository'],
})
export class StageModule {}
