import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateStageUseCase } from '../../../application/use-cases/create-stage.usecase';
import { ListStagesUseCase } from '../../../application/use-cases/list-stages.usecase';
import { CreateStageDto } from '../../../application/dtos/create-stage.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('stages')
@Controller('flows/:flowId/stages')
export class StageController {
  constructor(
    private readonly createStage: CreateStageUseCase,
    private readonly listStages: ListStagesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stage' })
  @ApiResponse({ status: 201, description: 'The stage has been successfully created.' })
  async create(@Param('flowId') flowId: string, @Body() dto: CreateStageDto) {
    const id = await this.createStage.execute(flowId, dto);
    return { id };
  }

  @Get()
  @ApiOperation({ summary: 'List all stages' })
  @ApiResponse({ status: 200, description: 'List of stages retrieved successfully.' })
  async list(@Param('flowId') flowId: string) {
    return this.listStages.execute(flowId);
  }
}
