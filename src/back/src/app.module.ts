import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ParceriasModule } from './parcerias/parcerias.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ExperienciasModule } from './experiencias/experiencias.module.js';
import { ProjetosModule } from './projetos/projetos.module.js';
import { OportunidadesModule } from './oportunidades/oportunidades.module.js';
import { FunilModule } from './funil/funil.module.js';
import { CategoriaModule } from './categoria/categoria.module.js';
import { CandidaturasModule } from './candidaturas/candidaturas.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [ 
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'back',
    }),
    UserModule,
    PrismaModule,
    ParceriasModule,
    ExperienciasModule,
    ProjetosModule,
    OportunidadesModule,
    FunilModule,
    AuthModule,
    CategoriaModule,
    CandidaturasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}