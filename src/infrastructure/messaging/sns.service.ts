import { Injectable } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { MessagingService } from '../../domain/interfaces/messaging.interface';

@Injectable()
export class SnsService implements MessagingService {
  private readonly snsClient = new SNSClient({});

  async publish(topicArn: string, message: any): Promise<void> {
    const cmd = new PublishCommand({
      TopicArn: topicArn,
      Message: JSON.stringify(message),
    });
    await this.snsClient.send(cmd);
  }
}
