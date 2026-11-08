import { Controller, Patch, Body, Param } from '@nestjs/common';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.userService.update(id, updateData);
  }
}