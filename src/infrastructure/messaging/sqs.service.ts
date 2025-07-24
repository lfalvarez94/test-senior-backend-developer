import { Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { MessageQueueService } from '../../domain/interfaces/message-queue.interface';

@Injectable()
export class SqsServiceImpl implements MessageQueueService {
  private readonly sqsClient = new SQSClient({});

  async sendDelayed(
    queueUrl: string,
    message: any,
    delaySeconds: number,
  ): Promise<void> {
    const cmd = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
      DelaySeconds: delaySeconds,
    });
    await this.sqsClient.send(cmd);
  }
}
