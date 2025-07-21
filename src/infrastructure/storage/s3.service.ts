import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as QRCode from 'qrcode';
import { S3Service } from '../../application/interfaces/s3.interface';

@Injectable()
export class S3ServiceImpl implements S3Service {
  private readonly s3 = new AWS.S3();
  private readonly bucket = process.env.S3_BUCKET!;

  async generateQr(code: string): Promise<Buffer> {
    return QRCode.toBuffer(code);
  }

  async upload(
    key: string,
    body: Buffer,
    contentType: string = 'image/png',
  ): Promise<void> {
    await this.s3
      .putObject({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
      .promise();
  }
}
