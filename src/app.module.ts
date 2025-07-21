import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FlowModule } from './presentation/modules/flow/flow.module';
import { StageModule } from './presentation/modules/stage/stage.module';
import { OrchestratorModule } from './presentation/modules/orchestrator/orchestrator.module';

@Module({
  imports: [
    // Lo registras una sola vez y es global en toda la app
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
