import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { MessagingService } from '../../domain/interfaces/messaging.interface';

@Injectable()
export class SnsService implements MessagingService {
  private readonly sns = new AWS.SNS();

  async publish(topicArn: string, message: any): Promise<void> {
    await this.sns
      .publish({
        TopicArn: topicArn,
        Message: JSON.stringify(message),
      })
      .promise();
  }
}
