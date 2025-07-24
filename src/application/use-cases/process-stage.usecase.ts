import { Injectable, Inject } from '@nestjs/common';
import { StageExecutionRepository } from '../../domain/interfaces/stage-execution-repository.interface';
import { StageRepository } from '../../domain/interfaces/stage-repository.interface';
import { MessagingService } from '../../domain/interfaces/messaging.interface';
import { MessageQueueService } from '../../domain/interfaces/message-queue.interface';
import { EmailService } from '../../domain/interfaces/email.interface';
import { StorageService } from '../../domain/interfaces/storage.interface';
import { PaymentService } from '../../domain/interfaces/payment.interface';
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
    @Inject('MessageQueueService') private readonly sqs: MessageQueueService,
    @Inject('EmailService') private readonly ses: EmailService,
    @Inject('StorageService') private readonly s3: StorageService,
    @Inject('PaymentService') private readonly stripe: PaymentService,
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

        case StageType.COUPON: {
          const qrBuffer = await this.s3.generateQr(stage.config.code);
          await this.s3.upload(`coupons/${exec.id}.png`, qrBuffer);
          exec.markDone();
          break;
        }

        case StageType.TICKET: {
          const session = await this.stripe.createSession(stage.config);
          exec.markInProgress();
          return;
        }
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
