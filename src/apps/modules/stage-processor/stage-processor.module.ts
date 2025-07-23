import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { StageExecutionRepositoryImpl } from '../../../infrastructure/prisma/stage-execution.repository';
import { StageRepositoryImpl } from '../../../infrastructure/prisma/stage.repository';
import { SnsService } from '../../../infrastructure/messaging/sns.service';
import { SqsServiceImpl } from '../../../infrastructure/messaging/sqs.service';
import { SesServiceImpl } from '../../../infrastructure/email/ses.service';
import { S3ServiceImpl } from '../../../infrastructure/storage/s3.service';
import { StripeServiceImpl } from '../../../infrastructure/stripe/stripe.service';
import { ProcessStageUseCase } from '../../../application/use-cases/process-stage.usecase';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: 'StageExecutionRepository',
      useClass: StageExecutionRepositoryImpl,
    },
    { provide: 'StageRepository', useClass: StageRepositoryImpl },
    { provide: 'MessagingService', useClass: SnsService },
    { provide: 'SqsService', useClass: SqsServiceImpl },
    { provide: 'SesService', useClass: SesServiceImpl },
    { provide: 'S3Service', useClass: S3ServiceImpl },
    { provide: 'StripeService', useClass: StripeServiceImpl },
    ProcessStageUseCase,
  ],
})
export class StageProcessorModule {}
