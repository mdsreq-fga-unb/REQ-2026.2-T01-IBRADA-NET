import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';

@Module({
    controllers: [UserController],
    providers: [],
})
export class UserModule {}
