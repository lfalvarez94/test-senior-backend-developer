export interface SesService {
  sendEmail(config: {
    to: string;
    from: string;
    subject: string;
    body: string;
  }): Promise<void>;
}
