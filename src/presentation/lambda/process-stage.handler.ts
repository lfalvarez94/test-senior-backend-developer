import { NestFactory } from '@nestjs/core';
import { StageProcessorModule } from '../../presentation/modules/stage-processor/stage-processor.module';
import { ProcessStageUseCase } from '../../application/use-cases/process-stage.usecase';
import { SNSEvent } from 'aws-lambda';

let processStageUseCase: ProcessStageUseCase;
const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(StageProcessorModule);
  processStageUseCase = app.get(ProcessStageUseCase);
};

export const handler = async (event: SNSEvent) => {
  if (!processStageUseCase) await bootstrap();
  for (const record of event.Records) {
    const msg = JSON.parse(record.Sns.Message);
    await processStageUseCase.execute(msg.stageExecutionId);
  }
};
