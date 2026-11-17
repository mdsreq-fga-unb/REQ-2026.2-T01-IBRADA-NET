import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { RolesGuard } from './roles.guard.js';
import { getJwtSecret } from './jwt-secret.js';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      // getJwtSecret lança erro se JWT_SECRET faltar: a aplicação não sobe sem segredo.
      useFactory: () => ({
        secret: getJwtSecret(),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [
    AuthService,
    // Ordem importa: primeiro autentica (JWT), depois confere o papel (@Roles).
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
