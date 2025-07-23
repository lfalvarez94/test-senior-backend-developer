export interface MessageQueueService {
  sendDelayed(
    queueUrl: string | undefined,
    message: any,
    delaySeconds: number,
  ): Promise<void>;
}
