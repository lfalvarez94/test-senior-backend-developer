import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { SqsService } from '../../application/interfaces/sqs.interface';

@Injectable()
export class SqsServiceImpl implements SqsService {
  private readonly sqs = new AWS.SQS();

  async sendDelayed(
    queueUrl: string,
    message: any,
    delaySeconds: number,
  ): Promise<void> {
    await this.sqs
      .sendMessage({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message),
        DelaySeconds: delaySeconds,
      })
      .promise();
  }
}
