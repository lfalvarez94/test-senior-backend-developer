import { Injectable, Inject } from '@nestjs/common';
import { StageExecutionRepository } from '../interfaces/stage-execution-repository.interface';
import { StageRepository } from '../interfaces/stage-repository.interface';
import { MessagingService } from '../interfaces/messaging.interface';
import { SqsService } from '../interfaces/sqs.interface';
import { SesService } from '../interfaces/ses.interface';
import { S3Service } from '../interfaces/s3.interface';
import { StripeService } from '../interfaces/stripe.interface';
import { ConfigService } from '@nestjs/config';
import { StageExecution } from '../../domain/entities/stage-execution.entity';
import { StageType } from '../../domain/enums/stage-type.enum';
import { StageExecutionStatus } from '../../domain/enums/stage-execution-status.enum';

@Injectable()
export class ProcessStageUseCase {
  constructor(
    @Inject('StageExecutionRepository')
    private readonly execRepo: StageExecutionRepository,
    @Inject('StageRepository') private readonly stageRepo: StageRepository,
    @Inject('MessagingService') private readonly messaging: MessagingService,
    @Inject('SqsService') private readonly sqs: SqsService,
    @Inject('SesService') private readonly ses: SesService,
    @Inject('S3Service') private readonly s3: S3Service,
    @Inject('StripeService') private readonly stripe: StripeService,
    private readonly config: ConfigService,
  ) {}

  async execute(stageExecutionId: string): Promise<void> {
    const topicArn = this.config.get('SNS_STAGE_COMPLETED_ARN');
    if (!topicArn) {
      throw new Error(
        'La variable SNS_STAGE_COMPLETED_ARN no está configurada',
      );
    }
    const exec = await this.execRepo.findById(stageExecutionId);
    if (!exec)
      throw new Error(`StageExecution ${stageExecutionId} no encontrado`);

    exec.markInProgress();
    await this.execRepo.update(exec);

    const stage = await this.stageRepo.findById(exec.stageId);
    if (!stage) throw new Error(`Stage ${exec.stageId} no encontrado`);

    try {
      switch (stage.stageType) {
        case StageType.POPUP_TEXT:
          exec.markDone();
          break;

        case StageType.DELAY:
          await this.sqs.sendDelayed(
            this.config.get('SQS_DELAY_QUEUE_URL'),
            { stageExecutionId },
            stage.config.timeout,
          );
          return;

        case StageType.EMAIL: {
          const { to, from, subject, body } = stage.config as {
            to: string;
            from: string;
            subject: string;
            body: string;
          };

          await this.ses.sendEmail({ to, from, subject, body });

          exec.markDone();
          break;
        }

        case StageType.POPUP_FORM:
          return;

        case StageType.COUPON:
          const qrBuffer = await this.s3.generateQr(stage.config.code);
          await this.s3.upload(`coupons/${exec.id}.png`, qrBuffer);
          exec.markDone();
          break;

        case StageType.TICKET:
          const session = await this.stripe.createSession(stage.config);
          exec.markInProgress();
          return;
      }

      await this.execRepo.update(exec);

      await this.messaging.publish(topicArn, {
        stageExecutionId,
        success: true,
      });
    } catch (error) {
      exec.markError(error.message);
      await this.execRepo.update(exec);
      await this.messaging.publish(topicArn, {
        stageExecutionId,
        success: false,
      });
    }
  }
}
