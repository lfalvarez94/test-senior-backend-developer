import { Injectable } from '@nestjs/common';
//import * as AWS from 'aws-sdk';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as QRCode from 'qrcode';
import { StorageService } from '../../domain/interfaces/storage.interface';

@Injectable()
export class S3ServiceImpl implements StorageService {
  private readonly s3Client = new S3Client({});
  private readonly bucket = process.env.S3_BUCKET!;

  async generateQr(code: string): Promise<Buffer> {
    return QRCode.toBuffer(code);
  }

  async upload(
    key: string,
    body: Buffer,
    contentType: string = 'image/png',
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    await this.s3Client.send(command);
  }
}
