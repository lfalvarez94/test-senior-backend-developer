export interface StorageService {
  generateQr(code: string): Promise<Buffer>;
  upload(key: string, body: Buffer, contentType?: string): Promise<void>;
}
