export interface EmailService {
  sendEmail(config: {
    to: string;
    from: string;
    subject: string;
    body: string;
  }): Promise<void>;
}
