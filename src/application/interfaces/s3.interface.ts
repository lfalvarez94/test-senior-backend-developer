export interface S3Service {
  generateQr(code: string): Promise<Buffer>;
  upload(key: string, body: Buffer, contentType?: string): Promise<void>;
}
