import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { EmailService } from '../../domain/interfaces/email.interface';

@Injectable()
export class SesServiceImpl implements EmailService {
  private readonly sesClient = new SESClient({});

  async sendEmail(config: {
    to: string;
    from: string;
    subject: string;
    body: string;
  }): Promise<void> {
    const cmd = new SendEmailCommand({
      Destination: { ToAddresses: [config.to] },
      Message: {
        Subject: { Data: config.subject },
        Body: { Html: { Data: config.body } },
      },
      Source: config.from,
    });
    await this.sesClient.send(cmd);
  }
}
