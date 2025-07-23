import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateFlowUseCase } from '../../../application/use-cases/create-flow.usecase';
import { ListFlowsUseCase } from '../../../application/use-cases/list-flows.usecase';
import { GetFlowUseCase } from '../../../application/use-cases/get-flow.usecase';
import { UpdateFlowUseCase } from '../../../application/use-cases/update-flow.usecase';
import { DeleteFlowUseCase } from '../../../application/use-cases/delete-flow.usecase';
import { RunFlowUseCase } from '../../../application/use-cases/run-flow.usecase';
import { CreateFlowDto } from '../../../application/dtos/create-flow.dto';
import { UpdateFlowDto } from '../../../application/dtos/update-flow.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('flows')
@Controller('flows')
export class FlowController {
  constructor(
    private readonly createFlow: CreateFlowUseCase,
    private readonly listFlows: ListFlowsUseCase,
    private readonly getFlow: GetFlowUseCase,
    private readonly updateFlow: UpdateFlowUseCase,
    private readonly deleteFlow: DeleteFlowUseCase,
    private readonly runFlow: RunFlowUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new flow' })
  @ApiResponse({ status: 201, description: 'The flow has been successfully created.' })
  async create(@Body() dto: CreateFlowDto) {
    const id = await this.createFlow.execute(dto);
    return { id };
  }

  @Get()
  @ApiOperation({ summary: 'List all flows' })
  @ApiResponse({ status: 200, description: 'The list of flows has been successfully retrieved.' })
  async list() {
    return this.listFlows.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a flow by ID' })
  @ApiResponse({ status: 200, description: 'The flow has been successfully retrieved.' })
  async findOne(@Param('id') id: string) {
    return this.getFlow.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a flow by ID' })
  @ApiResponse({ status: 200, description: 'The flow has been successfully updated.' })
  async update(@Param('id') id: string, @Body() dto: UpdateFlowDto) {
    await this.updateFlow.execute(id, dto);
    return { success: true };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a flow by ID' })
  @ApiResponse({ status: 200, description: 'The flow has been successfully deleted.' })
  async remove(@Param('id') id: string) {
    await this.deleteFlow.execute(id);
    return { success: true };
  }

  @Post(':id/run')
  @ApiOperation({ summary: 'Run a flow by ID' })
  @ApiResponse({ status: 200, description: 'The flow has been successfully run.' })
  async run(@Param('id') flowId: string, @Body('userId') userId?: string) {
    const executionId = await this.runFlow.execute(flowId, userId);
    return { executionId };
  }
}
