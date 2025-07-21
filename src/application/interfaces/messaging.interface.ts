export interface MessagingService {
  publish(topicArn: string, message: any): Promise<void>;
}
