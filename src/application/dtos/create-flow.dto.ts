import { IsOptional, IsString } from 'class-validator';

export class CreateFlowDto {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
