import { Module } from '@nestjs/common';
import { UserController } from './user.controller.ts';

@Module({
    controllers: [UserController],
    providers: [],
})
export class UserModule {}
