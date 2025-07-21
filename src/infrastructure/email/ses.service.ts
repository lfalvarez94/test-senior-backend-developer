import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { SesService } from '../../application/interfaces/ses.interface';

@Injectable()
export class SesServiceImpl implements SesService {
  private readonly ses = new AWS.SES();

  async sendEmail(config: {
    to: string;
    from: string;
    subject: string;
    body: string;
  }): Promise<void> {
    await this.ses
      .sendEmail({
        Destination: { ToAddresses: [config.to] },
        Message: {
          Subject: { Data: config.subject },
          Body: { Html: { Data: config.body } },
        },
        Source: config.from,
      })
      .promise();
  }
}
