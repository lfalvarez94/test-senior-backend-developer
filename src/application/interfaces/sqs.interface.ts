export interface SqsService {
  sendDelayed(
    queueUrl: string | undefined,
    message: any,
    delaySeconds: number,
  ): Promise<void>;
}
