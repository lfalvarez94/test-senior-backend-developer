import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FlowModule } from './apps/modules/flow/flow.module';
import { StageModule } from './apps/modules/stage/stage.module';
import { OrchestratorModule } from './apps/modules/orchestrator/orchestrator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FlowModule,
    StageModule,
    OrchestratorModule,
  ],
})
export class AppModule {}
